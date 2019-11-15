import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import {Component, OnChanges, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import {NewcourseComponent} from '../newcourse/newcourse.component';
// import {AdminService} from '../../services/admin.service';
import {Router} from '@angular/router';
import {UserModel} from '../../models/usermodel.models';
import {CoursesService} from '../../services/courses.service';
import { FBRegisterComponent } from '../fbregister/fbregister.component';
import {BehaviorSubject} from 'rxjs';
import {UsertypeModel} from '../../models/usertype.model';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {

  myCourses: CourseNav[] = []; // the user's courses names and id
  user: UserModel;
  FBuserID: string;
  adminCoureses: CourseNav[] = [];
  adminLoggedIn;
  // tslint:disable-next-line:variable-name
  private student_id = '';
  private subscriptions: Subscription[] = [];
  loggedIn;
  loading = false;
  private isRegistered: boolean;

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private dialog: MatDialog,
    private cookiesServices: CookieService,
    // private adminServices: AdminService,
    private router: Router
  ) {
    const jwtToken = this.userServices.getToken();
    this.loggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    // const jwtCookie = this.cookiesServices.check('admin-session');
    const jwtCookie = this.userServices.isTokenFresh('admin-session');
    this.adminLoggedIn = new BehaviorSubject<boolean>(!!jwtCookie);
    this.userServices.resetUserModel();
    // if (jwtToken) {
    //   this.userServices.submitLogin();
    // }
  }


  doLogin() {
    this.userServices.submitLogin();
    this.loggedIn.next(true);
    this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
      console.log(resp);
      this.loadCourses();
      if (!resp.user_info) {
        this.isRegistered = false;
        this.openRegisterStudentDialog();
      } else {
        this.isRegistered = true;
        console.log('AFTER DO LOGIN', resp.user_info);
        // window.localStorage.user_info = JSON.stringify(resp.user_info);
      }
    }));
  }

  openRegisterStudentDialog() {
    const dialogRef = this.dialog.open(FBRegisterComponent, {
      width: '90%',
      data: {
        id: this.userServices.fbUser().id,
        first_name: this.userServices.fbUser().first_name,
        last_name: this.userServices.fbUser().last_name,
        email: this.userServices.fbUser().email,
        type: UsertypeModel.Student
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.isRegistered = true;
        console.log(result);
      }
    }));
  }

  doLogout() {
    this.logout();
    this.myCourses = [];
    this.loggedIn.next(false);
  }

  // Runs whenever this component is loaded
  ngOnInit() {
    this.loadCourses();
    console.log('BEFORE GET CURR USER');
    console.log(this.userServices.getCurrentUser());
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  // submitLogin() {
  //   return this.userServices.submitLogin();
  // }
  //
  // getUserInfo() {
  //   this.subscriptions.push(this.userServices.getUserInfo(this.FBuserID).subscribe((resp: any) => {
  //     console.log(resp);
  //     this.user = resp.user_info;
  // }));
  //   return this.user;
  // }

  // getCurrentUser() {
  //   this.userServices.getCurrentUser().subscribe((resp: any) => {
  //     console.log(resp.userID);
  //     this.FBuserID = resp.userID;
  //   });
  //   return this.FBuserID;
  // }

  openAddCourseDialog() {
    const dialogRef = this.dialog.open(NewcourseComponent, {
      width: '90%',
      data: {
        name: 'Insert Course Title Here',
        description: 'Enter Course description here'
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        console.log(result);
      }
    }));
  }

  /**
   * Load courses, id and name, for the current user.
   */
  // loadCourses() {
  //   this.subscriptions.push(this.coursesServices.getStudentCourses(this.student_id).subscribe( (resp: CourseNav[]) => {
  //     this.myCourses = resp;
  //   } ));
  //
  //   if ( this.userServices.getIsAdmin() ) {
  //     this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe( (resp: CourseNav[]) => {
  //       this.adminCoureses = resp;
  //     }));
  //   } else {
  //     console.log('ERROR LOADING COURSES');
  //   }
  // }

  loadCourses() {
    console.log(this.loggedIn.value);
    console.log(this.adminLoggedIn.value);
    if (this.loggedIn.value || this.adminLoggedIn.value) {
      if (this.loggedIn.value) {
        this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: CourseNav[]) => {
          this.myCourses = resp;
        }));
      } else if (this.adminLoggedIn.value) {
        this.adminLoggedIn.next(true);
        this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe((resp: CourseNav[]) => {
          console.log(resp);
          this.adminCoureses = resp;
        }));
      }
    }
  }
    // if ( this.adminServices.getIsAdmin()) {
    //   this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe( (resp: CourseNav[]) => {
    //     this.adminCoureses = resp;
    //   }));
    // }

  toggleLogin() {
    this.userServices.toggleLoggedIn();
  }

  isLoggedIn() {
    return this.userServices.getIsLoggedIn();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  // logout() {
  //   this.userServices.logout();
  // }

  logout() {
    // this.adminServices.logOutUser();
    this.userServices.logout();
  }

  auth() {
    return this.userServices.getAuth();
  }

}
