import {Course} from '../../models/courses.models';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Component, Input, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  loading = true;
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
    if (this.userServices.getIsAdmin()) {
      this.coursesServices.getAdminCourses().subscribe((resp: Course[]) => {
        this.myCourses = resp;
        resp.forEach((course: Course) => {
          this.coursesServices.getCourseInfo(course.id)
            .subscribe((courseInfo: any) => {
              course.size = courseInfo.size;
              course.MAX_SIZE = courseInfo.MAX_SIZE;
              course.endEnrollDate = courseInfo.endEnrollDate;
              course.category = courseInfo.category;
              console.log(course.MAX_SIZE);
            });
        });
      });
    } else {
      this.myCourses = [];
      this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: Course[]) => {
        if (resp && resp.length === 0) {
          this.loading = false;
        }
        if (this.userServices.fbUser().id) {
          console.log(this.userServices.fbUser());
          resp.forEach((course: Course) => {
            this.coursesServices.getCourseInfo(course.id)
              .subscribe((courseInfo: any) => {
                course.size = courseInfo.size;
                course.MAX_SIZE = courseInfo.MAX_SIZE;
                // course.endEnrollDate = courseInfo.endEnrollDate;
                course.category = courseInfo.category;
                console.log(course.MAX_SIZE);
                this.coursesServices.getInstructorInfo(courseInfo.instructor).subscribe((instructor: any) => {
                  console.log('FOO ' + JSON.stringify(instructor));
                  course.instructor_name = instructor.name;
                  course.email = instructor.contactEmail;
                  this.myCourses.push(JSON.parse(JSON.stringify(course)));
                  this.loading = false;
                });
              });
          });
        } else {
          console.log('not authorized!');
        }
      }));
    }
  }

  ngOnInit() {
    this.loading = true;
    this.loadCourses();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}



