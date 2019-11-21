import {Course} from '../../models/courses.models';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
<<<<<<< HEAD
import {Component, Input, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';
=======
import {Component, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';

>>>>>>> 46a0012e400e636f693ac8362098da5380f5daf4

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  private subscriptions: Subscription[] =  [];
  myCourses: Course[] = []; // the user's courses names and id
  // tslint:disable-next-line:variable-name
  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,

  ) {
    this.userServices.resetUserModel();
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
<<<<<<< HEAD
    if (this.userServices.getIsAdmin()) {
      this.coursesServices.getAdminCourses().subscribe((resp: Course[]) => {
        this.myCourses = resp;
      });
    } else {
      this.myCourses = [];
      this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: Course[]) => {
        if (this.userServices.fbUser().id) {
          console.log(this.userServices.fbUser());
          resp.forEach((course: Course) => {
            this.coursesServices.getCourseInfo(course.id)
              .subscribe((courseInfo: any) => {
                this.coursesServices.getInstructorInfo(courseInfo.instructor).subscribe((instructor: any) => {
                  console.log('FOO ' + JSON.stringify(instructor));
                  course.instructor_name = instructor.name;
                  this.myCourses.push(JSON.parse(JSON.stringify(course)));
                });
              });
          });
        } else {
          console.log('not authorized!');
        }
      }));
=======
    if(this.userServices.getIsAdmin()) {
      this.coursesServices.getAdminCourses().subscribe(( resp: Course[]) => {
        this.myCourses = resp;
      })
    } else {
      this.subscriptions.push(this.userServices.getStudentCourses(this.student_id).subscribe( (resp: Course[]) => {
        this.myCourses = resp;
      } ));
    }
    // this.subscriptions.push(this.coursesServices.getInstructorInfo(this.myCourses)
    //     .subscribe( (course: (instructor: string, instructorEmail: string}) => {
    //       this.course = this.coursesServices.getInstructorInfo()

>>>>>>> 46a0012e400e636f693ac8362098da5380f5daf4
    }
  }

  ngOnInit() {
    this.loadCourses();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}



