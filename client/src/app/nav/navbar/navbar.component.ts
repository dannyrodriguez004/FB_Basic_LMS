import { CourseNav } from '../../models/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import {Component, NgZone, OnChanges, OnInit} from '@angular/core';
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
    public zone: NgZone
  ) {
    const jwtToken = this.userServices.getToken();
    this.loggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    this.userServices.resetUserModel();
  }

  doLogin() {
    this.userServices.submitLogin();
    this.userServices.FBLoggedIn.subscribe(bool => {
      console.log('############### FBLoggedIn changed to ' + bool);
      // this.loggedIn.next(true);
      this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
        console.log('42 - navbar.doLogin() - userServices.getCurrentUser() resp.user_info\n', resp);
        this.loadCourses();
        if (!resp.registered) {
          this.isRegistered = false;
          this.openRegisterStudentDialog();
        } else {
          this.isRegistered = true;
          console.log('52 - navbar.doLogin() - userServices.getCurrentUser() resp.registered\n', resp.registered);
          this.loggedIn.next(true);
          this.ngOnChanges();
        }
      }));
    });
  }

  openRegisterStudentDialog() {
    this.dialog.closeAll();
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
      console.log('LINE &$ $#########$');
      if (result) {
        this.isRegistered = true;
        this.loggedIn.next(true);
        console.log('77 - NAVBAR - dialogRef.afterClosed() - result\n', result);
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
    this.subscriptions.push(this.userServices.FBLoggedIn.subscribe( bool => {
      this.zone.run(() => {
        this.loadCourses();
      });
    }));
    console.log('95 - NAVBAR - ngOnInit() - userServices.getCurrentUser():  \n', this.userServices.getCurrentUser());
  }

  ngOnChanges() {
    this.subscriptions.push(this.userServices.FBLoggedIn.subscribe( bool => {
      this.zone.run(() => {
        this.loadCourses();
      });
    }));
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
      if (this.loggedIn.value || this.isAdmin()) {
        if (this.loggedIn.value) {
          console.log('108 - NAVBAR - loadCourses() - this.loggedIn.value: \n', this.loggedIn.value);
          this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: CourseNav[]) => {
            this.myCourses = resp;
          }));
        }
      }
      if (this.isAdmin()) {
        // this.adminLoggedIn.next(true);
        this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe((resp: CourseNav[]) => {
          console.log('117 - NAVBAR - loadCourses() - getAdminCourses\n', resp);
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
