import { CoursesService } from 'src/app/courses/courses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/user.service';

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
  options: any[];
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
    startTime:null,
    score: 0,
  };

  getOptions(item) {
    return this.quiz.items.find(item).options;
  }

  loading = true;

  serverTime: Date;

  private subscriptions: Subscription[] = [];
  assessment_id = '';
  current_course = '';
  current_module = '';
  select = 0;
  response = '';
  
  timeLeft;

  constructor(
    private routes: ActivatedRoute,
    private courseServices: CoursesService,
    private userServices: UserService
    ) {
    }

  getQuiz() {
    this.subscriptions.push(this.courseServices.getQuiz(this.current_course, this.current_module, this.assessment_id).subscribe( (resp:Quiz) => {
      this.quiz = resp as Quiz;
      
      console.log(resp as Quiz);
      this.subscriptions.push(this.courseServices.getServerTime().subscribe( (resp: Date) => {
        this.serverTime = new Date(resp);

        this.timeLeft = this.quiz.startTime.getTime == null ? 0 : Math.max(0, 10 - (( this.serverTime.getTime() -  new Date(this.quiz.startTime).getTime()) / 1000));
        //console.log(this.timeLeft);
        this.setStartTime();
      }));
    }));
  }

  submit() {
    console.log(this.quiz.items);
  }

  ngOnInit() {
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
      this.loading = false;
      
    }));
  }

  ngAfterViewInit() {
    
  }

  ring(x) {

    if(x.action === 'done') this.submitQuiz();
    if(x.action === 'notify' && x.left <= 60000 && this.quiz.time > 0) document.getElementById("counter").style.color = 'red';

  }

  submitQuiz() {
    const answers = [];

    this.quiz.items.forEach( (item: Item) => {
      answers.push({
        question: item.question,
        response: item.response,
      });
    });

    this.courseServices.submitQuiz(this.userServices.user(), this.current_course, this.current_module, this.assessment_id, answers).subscribe( (resp) => {
      if(resp)console.log('Quiz graded!');
    });
    
  }

  setStartTime() {
    this.courseServices.setQuizStartTime(this.userServices.user(), this.current_course, this.assessment_id).subscribe( (resp) => {
      console.log(resp);
    })
  }

  getQuestionSize(item) {
    return this.quiz.items.find(item).options.length;
  }

}
