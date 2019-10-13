import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-enroll',
  templateUrl: './confirm-enroll.component.html',
  styleUrls: ['./confirm-enroll.component.scss']
})
export class ConfirmEnrollComponent implements OnInit {

  students: {id: string, fname: string, lname: string, email: string, phone: string}[];

  subscriptions: Subscription[] = [];

  current_course: string = '';

  constructor(
    private coursesServices: CoursesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.queryParams.subscribe( params => {
      if(params.course) {
        this.current_course = params.course;
      }
      this.subscriptions.push(this.coursesServices.getRegistered(this.current_course).subscribe( (resp : {id: string, fname: string, lname: string, email: string, phone: string}[]) => {
        this.students = resp;
        console.log(resp);
      }));
    }));


  }



}
