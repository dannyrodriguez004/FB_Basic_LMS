import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import {Component, OnChanges, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { CourseDetailEditorComponent } from '../../courses/course/info/course-detail-editor/course-detail-editor.component';
import {NewcourseComponent} from '../newcourse/newcourse.component';
import {AdminService} from '../../services/admin.service';
import {Router} from '@angular/router';
import {UserModel} from '../../models/usermodel.models';
import {CoursesService} from '../../services/courses.service';
import { RegisterComponent } from '../../security/register/register.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {

  myCourses: CourseNav[] = []; // the user's courses names and id
  user: UserModel;
  FBuserID: string;
  // tslint:disable-next-line:variable-name
  private student_id = '';
  private subscriptions: Subscription[] = [];
  loggedIn;
  loading = false;

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private dialog: MatDialog,
    private adminServices: AdminService,
    private router: Router,
  ) {
    this.userServices.isLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    // get debug student id
  }); }

  doLogin() {
    this.submitLogin();
    // if (this.loggedIn === false) {
    this.openRegisterStudentDialog();
    // }
  }

  openRegisterStudentDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '90%',
      data: {
        first_name: 'Insert Course Title Here',
        last_name: 'Enter Course description here',
        email: 'Insert email here',
        phone: 'Insert Phone number here',
        country: 'Insert Country here'
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
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
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  submitLogin() {
    return this.userServices.submitLogin();
  }

  getCurrentUser() {
    this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
      this.FBuserID = resp.userID;
    }));
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
