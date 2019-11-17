import { YesNoDialogComponent } from './../../yes-no-dialog/yes-no-dialog.component';
import { NewcourseComponent } from './../../nav/newcourse/newcourse.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CoursesService } from 'src/app/services/courses.service';

interface Course {
  category: string;
  id: string;
  instructor: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.scss']
})
export class ManageCoursesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'instructor', 'category', 'actions'];

  courses: Course[] = [];

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private dialog: MatDialog
  ) { 
  }

  ngOnInit() {
    this.coursesServices.getAdminCourses().subscribe( (resp: Course[]) => {
      this.courses = resp;
      this.courses.forEach( course => {
        this.coursesServices.getInstructorInfo(course.instructor).subscribe((inst: {contactEmail: string, name: string}) => {
          course.instructor = inst.name;
          course.email = inst.contactEmail;
        }); 
      })
    })
  }

  openAddCourseDialog() {
    const dialogRef = this.dialog.open(NewcourseComponent, {
      width: '90%',
      data: {
        name: 'Insert Course Title Here',
        description: 'Enter Course description here'
      }
    });
    dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  removeCourse(course) {
    const YesNoRef = this.dialog.open(YesNoDialogComponent, {
      width: '90%',
      data: {
        title: "Warning!",
        message: "Do you really want to delete this course?\n This action cannot be undone.",
      }
    });

    YesNoRef.afterClosed().subscribe(resp => {
      if(resp) {
        console.log('deleting course', course);
      }
    })
  }

}
