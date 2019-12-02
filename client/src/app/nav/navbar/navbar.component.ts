import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import {Component, OnChanges, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import {NewcourseComponent} from '../newcourse/newcourse.component';
import {UserModel} from '../../models/usermodel.models';
import {CoursesService} from '../../services/courses.service';
import { FBRegisterComponent } from '../fbregister/fbregister.component';
import {BehaviorSubject} from 'rxjs';
import {UsertypeModel} from '../../models/usertype.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {

  myCourses: CourseNav[] = []; // the user's courses names and id
  user: UserModel;
  adminCourses: CourseNav[] = [];
  public subscriptions: Subscription[] = [];
  loggedIn;
  loading = false;
  public isRegistered: boolean;

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    public dialog: MatDialog,
  ) {
    const jwtToken = this.userServices.getToken();
    this.loggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    this.userServices.resetUserModel();
  }

  doLogin() {
    this.userServices.submitLogin();
    this.userServices.FBLoggedIn.subscribe(bool => {
      console.log('############### FBLoggedIn changed to ' + bool);
      this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
        console.log('42 - navbar.doLogin() - userServices.getCurrentUser() resp.user_info', resp);
        this.loadCourses();
        if (resp.registered) {
          this.loggedIn.next(true);
          this.isRegistered = true;
          console.log('48 - navbar.doLogin() - userServices.getCurrentUser() resp.user_info', resp);
        } else {
          this.isRegistered = false;
          this.openRegisterStudentDialog();
        }
      }));
    });
    // this.loggedIn.next(this.isRegistered);
  }

  openRegisterStudentDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(FBRegisterComponent, {
      width: '90%',
      data: {
        // id: this.userServices.fbUser().id,
        // first_name: this.userServices.fbUser().first_name,
        // last_name: this.userServices.fbUser().last_name,
        // email: this.userServices.fbUser().email,
        type: UsertypeModel.Student
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.isRegistered = true;
        this.loggedIn.next(true);
        console.log(result);
      } else {
        this.isRegistered = false;
        this.loggedIn.next(false);
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
    console.log('92 - navbar.component.ts ngOnInit() - this.userServices.getCurrentUser():  ',
      this.userServices.getCurrentUser());
  }

  ngOnChanges() {
    this.ngOnInit();
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
      if (this.loggedIn.value || this.isAdmin()) {
        if (this.loggedIn.value) {
          console.log('121 - navbar.component.ts loadCourses() - this.loggedIn.value:    ',
            this.loggedIn.value);
          this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: CourseNav[]) => {
            this.myCourses = resp;
          }));
        }
      }
      if (this.isAdmin()) {
        // this.adminLoggedIn.next(true);
        this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe((resp: CourseNav[]) => {
          console.log(resp);
          this.adminCourses = resp;
        }));
    }
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  logout() {
    this.userServices.logout();
  }

  auth() {
    return this.userServices.getAuth();
  }

}
