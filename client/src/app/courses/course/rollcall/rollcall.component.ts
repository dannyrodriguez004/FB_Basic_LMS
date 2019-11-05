import { UserService } from '../../../user.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../courses.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {Students} from '../../../models/courses.models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-rollcall',
  templateUrl: './rollcall.component.html',
  styleUrls: ['./rollcall.component.scss']
})

export class RollcallComponent implements OnInit {

  loading = true;
  @Input('current_course') current_course: string;
  students: {id: '', fname: '', lname: '', email: ''}[];
  subscriptions: Subscription[] = [];

  constructor(
    private courseServices: CoursesService,
    private userServices: UserService,
    private route: ActivatedRoute
  ) {}


  loadData() {
    this.subscriptions.push(this.courseServices.getStudents(this.current_course)
      .subscribe( (resp: {id: '', fname: '', lname: '', email: ''}[]) => {
        this.students = resp;
        console.log(resp);
      }));
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.loadData();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

}
