import { Component, OnInit } from '@angular/core';
import {CoursesService} from '../courses.service';
import {UserService} from '../../user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Course} from '../courses.models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  courses: Course[] = []; // the user's courses names and id
  course = {name: '', id: '', description: '', instructor: ''};

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router
  ) {
  }

  loadData() {
    this.subscriptions.push(this.coursesServices.getAllCourses().subscribe( (resp: Course[]) => {
      this.courses = resp;
    }));
  }

  ngOnInit() {
    this.loadData();
    // this.subscriptions.push(this.router.events.subscribe((e:any) => {
    //   if(e instanceof NavigationEnd) {
    //     this.loadData();
    //   }
    // }));
  }
}
