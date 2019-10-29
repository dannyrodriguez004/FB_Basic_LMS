import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import {Component, OnChanges, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { CourseDetailEditorComponent } from '../../courses/course/info/course-detail-editor/course-detail-editor.component';
import {NewcourseComponent} from '../newcourse/newcourse.component';
import {AdminService} from '../../services/admin.service';
import {Router} from '@angular/router';
import {User} from '../../models/users.models';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {

  myCourses: CourseNav[] = []; // the user's courses names and id
  user: User;
  private student_id = '';
  private subscriptions: Subscription[] = [];
  loggedIn;
  balance;
  email = 'foo@mail';
  password = '1234';
  constructor(
    private userServices: UserService,
    private dialog: MatDialog,
    private adminServices: AdminService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    // get debug student id
  }); }

  doLogin() {
    this.authService.login(this.email, this.password);
  }

  doLogout() {
    this.authService.logout();
  }

  // Runs whenever this component is loaded
  ngOnInit() {
    this.loadCourses();
    // this.userServices.getCurrentUser();
    console.log('BEFORE GET CURR USER');
    this.getCurrentUser().subscribe(resp => {
      console.log('CURR USER RESPONSE', resp);
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  submitLogin() {
     return this.userServices.submitLogin();
  }

  getCurrentUser() {
     return this.userServices.getCurrentUser();
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
    this.subscriptions.push(this.userServices.getStudentCourses(this.student_id).subscribe( (resp: CourseNav[]) => {
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
    this.adminServices.logOutUser();
  }
}
