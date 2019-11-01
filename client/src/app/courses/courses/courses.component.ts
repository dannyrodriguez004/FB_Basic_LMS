import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import {UserService} from '../../user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Course} from '../courses.models';
import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';

const COURSE_PER_PAGE = 10;

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  courses = []; // the user's courses names and id
  private startFrom: number = 0;
  private sort: string = 'name';
  private size: number = 0;
  currentCategory: string = 'Mathematics';
  loading = false;


  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.fetchPage();
  }


  fetchPage(){
    this.loading = true;
    if(this.currentCategory == 'null') {
      this.coursesServices.getCoursesSortBy(this.sort, this.startFrom).subscribe( (resp:{ courses: [], size: number}) => {
        this.size = resp.size;
        this.courses = resp.courses;
        this.loading = false;
      });
    } else {
      this.coursesServices.getCoursesCatergorySortBy(this.currentCategory, this.sort, this.startFrom).subscribe( (resp:{ courses: [], size: number}) => {
        this.size = resp.size;
        this.courses = resp.courses;
        this.loading = false;
      });
    }
    
  }

  register(course) {
    this.coursesServices.canRegister(this.userServices.user(), course).subscribe((resp:{stat: Boolean, message: string}) => {
      if(resp.stat) {
        this.coursesServices.tryEnroll(this.userServices.user(), course).subscribe((resp) => {
          if(resp) {
            console.log("enrolled");
          }
        });
      } else {
        console.log(resp.message);
      }
    });
    
  }

  openFullDialog(course) {
    console.log(course);
    this.coursesServices.canRegister(this.userServices.user(), course).subscribe((resp:{stat: Boolean, message: string}) => {
      if(resp.stat) {
        const dialogRef = this.dialog.open(YesNoDialogComponent, {
          width: "50%",
          data: {
            title: "Course is Full!",
            message: "Would you like to be placed in the waiting list?\n\nYou will be notified if you a spot becomes available!"
          }
        });
    
        dialogRef.afterClosed().subscribe( (resp) => {
          if(resp) {
            console.log("trying to insert into class");
            this.coursesServices.tryEnroll(this.userServices.user(), course).subscribe((resp) => {
              if(resp) {
                console.log("enrolled");
              } 
            });
          }
        });
      } else {
        console.log(resp.message);
      }
    });
    
  }

  // can only go to a previous page if current start position is not in the first page.
  canBack() {
    return this.startFrom >= COURSE_PER_PAGE;
  }


  // navigates to the previous discussion posts page
  back() {
    this.startFrom += -(COURSE_PER_PAGE);
    this.setParams();
  }

  // true if not on first page
  canNext() {
    return (this.startFrom + COURSE_PER_PAGE) < this.size;
  }

  // navigates to next page of discussion posts
  next() {
    this.startFrom += (COURSE_PER_PAGE);
    this.setParams();
  }

  // navigates to first page of discussion posts
  firstPage() {
    this.startFrom = 0;
    this.setParams();
  }

  //navigates to the last page of discussion posts
  lastPage() {
    if(this.size > COURSE_PER_PAGE) {
      this.startFrom = Math.trunc(this.size/ COURSE_PER_PAGE) * COURSE_PER_PAGE
    }
    console.log(this);
    this.setParams();
  }

  // sets the parameters for navigation and reloads the discussion
  setParams() {
    this.router.navigate(['/nav/courses'],{ queryParams: {start: this.startFrom, category: this.currentCategory, sort: this.sort} });
    this.fetchPage();
  }

  getCategories() {
    return this.coursesServices.getAllCategories();
  }

  setCategories(category) {
    this.currentCategory = category;
    this.startFrom = 0;
    this.sort = 'name';
    this.setParams();
  }

  
}
