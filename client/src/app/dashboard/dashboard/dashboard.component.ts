import {Course} from '../../models/courses.models';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Component, Input, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';
import {UserModel} from '../../models/usermodel.models';


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
    // this.user.id = this.userServices.fbUser().id; // get debug student id
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
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
                // console.log('BOO ' + JSON.stringify(courseInfo));
                this.coursesServices.getInstructorInfo(courseInfo.instructor).subscribe((instructor: any) => {
                  console.log('FOO ' + JSON.stringify(instructor));
                  course.instructor_name = instructor.name;
                  this.myCourses.push(JSON.parse(JSON.stringify(course)));
                });
              });
          });
        } else {
          console.log('not authorized!');
          // this.router.navigateByUrl('/');
        }
      }));
    }
  }
  // loadCourses() {
  //   if (this.userServices.getIsAdmin()) {
  //     this.coursesServices.getAdminCourses().subscribe((resp: Course[]) => {
  //       this.myCourses = resp;
  //     });
  //   } else {
  //     this.coursesServices.getStudentCourses().subscribe((resp: Course[]) => {
  //       console.log(resp);
  //       this.myCourses = resp;
  //       this.subscriptions.push(this.coursesServices.getCourseInfo(this.myCourses).subscribe((course: Course[]) => {
  //         console.log(course);
  //         this.course = course;
  //       }));
  //       this.subscriptions.push(this.coursesServices.getInstructorInfo(this.myCourses)
  //         .subscribe((response: Course) => {
  //           console.log(response);
  //           this.course = response.instructor_name;
  //         }));
  //     });
  //   }
  // }

  ngOnInit() {
    this.loadCourses();

      }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}



