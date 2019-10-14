import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { Assessment, Question } from './../courses.models';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {


  private items: Question[] = [
    {id: 0, title: "Quiz 1", val: 10, question: "Which bear is best1?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ], response: ""} as Question,
    {id: 1, title: "Quiz 1", val: 10, question: "Which bear is best2?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ], response: ""} as Question,
    {id: 2, title: "Quiz 1", val: 10, question: "Which bear is best3?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ], response: ""} as Question,
    {id: 3, title: "Quiz 1", val: 10, question: "Which bear is best4?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ], response: ""} as Question,
    {id: 4, title: "Quiz 1", val: 10, question: "Which bear is best5?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ], response: ""} as Question,
  ];

  private subscriptions: Subscription[] = [];
  assessment_id = '';
  current_course = '';
  select = 0;
  item = this.items[this.select];
  response = '';
  
  time = 10;

  config: CountdownConfig = {
    demand: false,
    leftTime: (this.time * .5),
    format: 'HH:mm:ss'
  }

  @ViewChild('countDown', {static: false}) private countdown: CountdownComponent;

  constructor(private routes: ActivatedRoute) { }

  nextQuestion() {
    this.select = this.select + 1;
    this.loadItem();
  }

  canNext() {
    return this.select < this.items.length - 1;
  }

  prevQuestion() {
    this.select = this.select - 1;
    this.loadItem();
  }

  loadItem() {
    this.item = this.items[this.select];
    this.response = this.items[this.select].response;
  }

  submit() {
    this.items[this.select].response = this.response.toString();
  }

  ngOnInit() {
    this.subscriptions.push(this.routes.queryParams.subscribe( (params) => {
      if(params.course) {
        this.current_course = params.course;
      }
      if(params.id) {
        this.assessment_id = params.id;
      }
    }));
  }

  ring(x) {
    if(x.action === 'done')
    console.log("Timer ran out", x);
  }
}
