import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../user.service';
import {Component, OnChanges, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { CourseDetailEditorComponent } from '../../courses/course/info/course-detail-editor/course-detail-editor.component';
import {NewcourseComponent} from '../newcourse/newcourse.component';
import {AdminService} from '../../admin.service';
import {Router} from '@angular/router';
import {UserModel} from '../../models/usermodel.models';
import {CoursesService} from '../../courses/courses.service';
import { FBRegisterComponent } from '../fbregister/fbregister.component';

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
    private adminServices: AdminService,
    private router: Router
  ) {
    this.userServices.isLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      this.isRegistered = true;
  }); }

  doLogin() {
    this.userServices.submitLogin();
    this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
      console.log(resp);
      if (!resp.user_info) {
        this.isRegistered = false;
        this.openRegisterStudentDialog();
      } else {
        this.isRegistered = true;
      }
    }));
  }

  openRegisterStudentDialog() {
    const dialogRef = this.dialog.open(FBRegisterComponent, {
      width: '90%',
      data: {
        id: this.userServices.user().id,
        first_name: this.userServices.user().first_name,
        last_name: this.userServices.user().last_name,
        email: this.userServices.user().email
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
    this.ngOnInit();
  }
  // Runs whenever this component is loaded
  ngOnInit() {
    this.loadCourses();
    console.log('BEFORE GET CURR USER');
    this.getCurrentUser();
    this.getUserInfo();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  submitLogin() {
    return this.userServices.submitLogin();
  }

  getUserInfo() {
    this.subscriptions.push(this.userServices.getUserInfo(this.getCurrentUser()).subscribe((resp: any) => {
      console.log(resp);
      this.user = resp.user_info;
  }));
    return this.user;
  }

  getCurrentUser() {
    this.userServices.getCurrentUser().subscribe((resp: any) => {
      console.log(resp.userID);
      this.FBuserID = resp.userID;
    });
  }

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
  loadCourses() {
    this.subscriptions.push(this.coursesServices.getStudentCourses(this.student_id).subscribe( (resp: CourseNav[]) => {
      this.myCourses = resp;
    } ));

    if ( this.userServices.getIsAdmin() ) {
      this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe( (resp: CourseNav[]) => {
        this.adminCoureses = resp;
      }));
    } else {
      console.log('ERROR LOADING COURSES');
    }
  }

  toggleLogin() {
    this.userServices.toggleLoggedIn();
  }

  isLoggedIn() {
    return this.userServices.fbLoggedIn;
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  logout() {
    this.userServices.logout();
  }

  auth() {
    return this.adminServices.getAuth();
  }

}
