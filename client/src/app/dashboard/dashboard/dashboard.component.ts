import {Course} from '../../models/courses.models';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Component, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  private subscriptions: Subscription[] =  [];
  myCourses: Course[] = []; // the user's courses names and id

  // tslint:disable-next-line:variable-name
  private student_id: string;
  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,

  ) {
    this.student_id = this.userServices.fbUser().id; // get debug student id
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
    if(this.userServices.getIsAdmin()) {
      this.coursesServices.getAdminCourses().subscribe(( resp: Course[]) => {
        this.myCourses = resp;
      })
    } else {
      this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe( (resp: Course[]) => {
        this.myCourses = resp;
      } ));
    }
    // this.subscriptions.push(this.coursesServices.getInstructorInfo(this.myCourses)
    //     .subscribe( (course: (instructor: string, instructorEmail: string}) => {
    //       this.course = this.coursesServices.getInstructorInfo()

    }


  ngOnInit() {
    this.loadCourses();

      }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}



