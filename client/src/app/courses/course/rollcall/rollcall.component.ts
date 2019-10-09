import { UserService } from './../../../user.service';
import { Subscription } from 'rxjs';
import { CoursesService } from './../../courses.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Students} from '../../courses.models';

@Component({
  selector: 'app-rollcall',
  templateUrl: './rollcall.component.html',
  styleUrls: ['./rollcall.component.scss']
})

export class RollcallComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  // private students: Students[] =  [];
  loading = true;
  private students =  [];
  student: {id: string, name: string}[]
  @Input('current_course') current_course: string;

  constructor(
    private courseServices: CoursesService,
    private userServices: UserService,
  ) {
  }

  loadData() {
    // const student = this.courseServices.getStudents(this.current_course);
    this.subscriptions.push(this.courseServices.getStudents(this.current_course)
      .subscribe( (resp: []) => {
        this.students = resp;
        this.loading = false;
      }));
  }
  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

}
