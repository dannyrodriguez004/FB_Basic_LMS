import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import {UserService} from '../../user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Course} from '../courses.models';
import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  courses = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // the user's courses names and id


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
  }

  enroll() {

  }

  openFullDialog() {
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
      }
    })
  }
}
