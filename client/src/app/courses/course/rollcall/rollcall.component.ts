import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-rollcall',
  templateUrl: './rollcall.component.html',
  styleUrls: ['./rollcall.component.scss']
})

export class RollcallComponent implements OnInit {

  loading = true;
  // tslint:disable-next-line:no-input-rename variable-name
  @Input('current_course') current_course: string;
  students: {id: '', fname: '', lname: '', email: ''}[];
  subscriptions: Subscription[] = [];

  constructor(
    private courseServices: CoursesService,
    private userServices: UserService,
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
