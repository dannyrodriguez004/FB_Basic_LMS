import { CourseNav } from './../../courses/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from './../../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  myCourses: CourseNav[] = []; // the user's courses names and id

  private student_id = '';
  private subscriptions: Subscription[] = [];

  constructor(private userServices: UserService) {
    this.student_id = this.userServices.user(); // get debug student id
   }

  // Runs whenever this component is loaded
  ngOnInit() {

    this.loadCourses();
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
    this.subscriptions.push(this.userServices.getStudentCourses(this.student_id).subscribe( (resp: CourseNav[]) => {
      this.myCourses = resp;
    } ));
  }

  toggleAdmin() {
    this.userServices.ToggleIsAdmin();
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
}
