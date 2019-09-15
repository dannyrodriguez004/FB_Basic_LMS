import { Assessment, Question } from './../courses.models';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {


  private items: Question[] = [
    {title: "Quiz 1", val: 10, question: "Which bear is best1?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ]} as Question,
    {title: "Quiz 1", val: 10, question: "Which bear is best2?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ]} as Question,
    {title: "Quiz 1", val: 10, question: "Which bear is best3?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ]} as Question,
    {title: "Quiz 1", val: 10, question: "Which bear is best4?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ]} as Question,
    {title: "Quiz 1", val: 10, question: "Which bear is best5?", answer: "Black Bear", options: [
      'Black Bear', 'Polar Bear', 'Cave Bear', 'Brown Bear'
    ]} as Question,
  ];

  private subscriptions: Subscription[] = [];
  assessment_id = '';
  current_course = '';
  select = 0;
  item = this.items[this.select];
  response = '';

  

  constructor(private routes: ActivatedRoute) { }

  nextQuestion() {
    this.select = this.select + 1;
    this.loadItem();
    this.response = ''; // load answer if exists
  }

  canNext() {
    return this.select < this.items.length - 1;
  }

  prevQuestion() {
    this.select = this.select - 1;
    this.loadItem();
    this.response = ''; // load answer if exists
  }

  loadItem() {
    this.item = this.items[this.select];
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

}