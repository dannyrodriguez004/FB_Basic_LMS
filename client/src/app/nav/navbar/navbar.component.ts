import { CoursesService } from 'src/app/services/courses.service';
import { CourseNav } from './../../courses/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CourseDetailEditorComponent } from '../../courses/course/info/course-detail-editor/course-detail-editor.component';
import {NewcourseComponent} from '../newcourse/newcourse.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  myCourses: CourseNav[] = []; // the user's courses names and id
  adminCoureses: CourseNav[] = [];

  private student_id = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private userServices: UserService,
    private dialog: MatDialog,
    private coursesServices: CoursesService,
  ) {
    this.student_id = this.userServices.user(); // get debug student id
  }

  // Runs whenever this component is loaded
  ngOnInit() {

    this.loadCourses();
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
      if(result) {
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
    }));

    if( this.userServices.getIsAdmin()){
      this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe( (resp: CourseNav[]) => {
        this.adminCoureses = resp;
      }))
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
    this.userServices.logOutUser();
  }

  auth() {
    return this.userServices.getAuth();
  }

}