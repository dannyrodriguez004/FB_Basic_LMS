import { Assessment, Question } from '../../models/courses.models';
// import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { CoursesService } from '../../services/courses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';

export class Quiz {
  title: string;
  outOf: number;
  attempts: number;
  items: Item[];
  attempted: number;
  dueDate: Date;
  doneOn: Date;
  time: number;
  startTime: Date;
  score: number;
}

export class Item {
  question: string;
  options: string[];
  value: number;
  response: string;
}


@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})

export class AssessmentComponent implements OnInit, AfterViewInit {

  public quiz: Quiz = {
    title: '',
    outOf: 0,
    attempts: -1,
    items: [{question: '', options: [], value: 0, response: ''}],
    attempted: 0,
    dueDate: null,
    doneOn: null,
    time: 0,
    startTime: null,
    score: 0,
  };

  loading = true;

  serverTime: Date;

  private subscriptions: Subscription[] = [];
  // tslint:disable-next-line:variable-name
  assessment_id = '';
  // tslint:disable-next-line:variable-name
  current_course = '';
  // tslint:disable-next-line:variable-name
  current_module = '';
  select = 0;
  item: Item;
  response = '';
  time = 10;

  // config: CountdownConfig = {
  //   demand: false,
  //   leftTime: (this.time * .5),
  //   format: 'HH:mm:ss'
  // };
  //
  // @ViewChild('countDown', {static: false}) private countdown: CountdownComponent;

  timeLeft;

  constructor(
    private routes: ActivatedRoute,
    private courseServices: CoursesService
    ) {
    }

  getQuiz() {
    // tslint:disable-next-line:max-line-length
    this.subscriptions.push(this.courseServices.getQuiz(this.current_course, this.current_module, this.assessment_id)
      .subscribe( (resp: Quiz) => {
      this.quiz = resp;

      // console.log(resp as Quiz);
        // tslint:disable-next-line:no-shadowed-variable
      this.subscriptions.push(this.courseServices.getServerTime().subscribe( (resp: Date) => {
        this.serverTime = new Date(resp);

        this.timeLeft = this.quiz.startTime.getTime == null ? 0 : Math.max(0, 10 - (
          ( this.serverTime.getTime() -  new Date(this.quiz.startTime).getTime()) / 1000));
        // console.log(this.timeLeft);
      }));
    }));
  }

  submit() {
    console.log(this.quiz.items);
  }

  ngOnInit() {
    this.subscriptions.push(this.routes.queryParams.subscribe( (params) => {
      if (params.course) {
        this.current_course = params.course;
      }
      if (params.id) {
        if (params.module) {
          this.current_module = params.module;
        }
        if (params.id) {
          this.assessment_id = params.id;
        }
        this.getQuiz();
        this.loading = false;
      }}));
  }

  ngAfterViewInit() {

  }

  ring(x) {
    if (x.action === 'done') {
    this.submitQuiz();
    }

    if (x.action === 'done') { this.submitQuiz(); }
    if (x.action === 'notify' && x.left <= 60000 && this.quiz.time > 0) { document.getElementById('counter').style.color = 'red'; }

  }

  submitQuiz() {
    console.log('QUIZ SUBMITTED!');
  }

}
