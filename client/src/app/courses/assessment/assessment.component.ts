import { CoursesService } from 'src/app/courses/courses.service';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { Question } from './../courses.models';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

export class Quiz {
  title: string;
  outOf: number;
  attempts: number;
  items: Item[];
  attempted: number;
  dueDate: Date;
  doneOn: Date;
  time: number;
  startTime:Date;
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
export class AssessmentComponent implements OnInit {

  private quiz: Quiz = {
    title: '',
    outOf: 0,
    attempts: -1,
    items: [{question: '', options: [], value: 0, response: ''}],
    attempted: 0,
    dueDate: null,
    doneOn: null,
    time: -1,
    startTime:null,
    score: 0,
  };

   

  serverTime;

  private subscriptions: Subscription[] = [];
  assessment_id = '';
  current_course = '';
  current_module = '';
  select = 0;
  item: Item;
  response = '';
  
  time = 30;

  config: CountdownConfig = {
    demand: false,
    leftTime: (this.quiz.time > 0 ? this.quiz.time : 0 * 60),
    format: 'HH:mm:ss',
    notify: 0,
  }

  @ViewChild('countDown', {static: false}) private countdown: CountdownComponent;

  constructor(
    private routes: ActivatedRoute,
    private courseServices: CoursesService
    ) {
      this.subscriptions.push(this.routes.queryParams.subscribe( (params) => {
        if(params.course) {
          this.current_course = params.course;
        }
        if(params.module) {
          this.current_module = params.module;
        }
        if(params.id) {
          this.assessment_id = params.id;
        }
        this.getQuiz();
      }));
    }

  nextQuestion() {
    this.select = this.select + 1;
    this.loadItem();
  }

  canNext() {
    return this.select < this.quiz.items.length - 1;
  }

  prevQuestion() {
    this.select = this.select - 1;
    this.loadItem();
  }

  loadItem() {
    if(this.quiz.items.length > 0) {
      this.item = this.quiz.items[this.select];
      this.response = this.quiz.items[this.select].response;
    }
  }

  getQuiz() {
    this.subscriptions.push(this.courseServices.getQuiz(this.current_course, this.current_module, this.assessment_id).subscribe( (resp:Quiz) => {
      this.quiz = resp;
      this.loadItem();
      console.log(resp as Quiz);
    }));
  }

  submit() {
    console.log(this.quiz.items);
  }

  ngOnInit() {
  }

  ring(x) {
    if(x.action === 'done') this.submitQuiz();
    if(x.action === 'notify' && x.left <= 60000 && this.quiz.time > 0) document.getElementById("counter").style.color = 'red';

    console.log(x);
  }

  submitQuiz() {
    console.log("QUIZ SUBMITTED!");
  }

  getTime() {
    this.subscriptions.push(this.courseServices.getServerTime().subscribe( (resp) => {
      this.serverTime = resp;
    }));

    return this.serverTime;
  }
}
