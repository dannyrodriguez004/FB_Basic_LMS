import { CoursesService } from 'src/app/services/courses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

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
  saving = false;
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
    private userServices: UserService,
    private router: Router
    ) {
    }

  getQuiz() {
    this.subscriptions.push(this.courseServices.getQuiz(this.current_course, this.current_module, this.assessment_id).subscribe( (resp:Quiz) => {
      this.quiz = resp as Quiz;
      console.log(this.quiz);
      this.courseServices.getStudentQuizRecord(this.userServices.user(), this.current_course, this.assessment_id).subscribe( (resp: 
        {title: string, attempted: number, doneOn: Date, dueDate: Date, outOf: number, startTime: Date, items: Item[]}) => {

          this.quiz.attempted = resp.attempted;
          this.quiz.doneOn = new Date(resp.doneOn);
          this.quiz.startTime = new Date(resp.startTime);
          
          for(let i = 0; i < this.quiz.items.length; i++) {
            this.quiz.items[i].response = resp.items[i].response;
          }

          console.log(resp as Quiz);
        this.subscriptions.push(this.courseServices.getServerTime().subscribe( (resp: Date) => {
        this.serverTime = new Date(resp);

        if((new Date(this.quiz.dueDate)).getTime() < this.serverTime.getTime()) {
          this.router.navigate(['/nav/courses/view-course'], { queryParams: {course:this.current_course, select:'Home'} });
        }

        this.timeLeft = this.quiz.startTime.getTime == null ? 0 : Math.max(0, 10 - (( this.serverTime.getTime() -  new Date(this.quiz.startTime).getTime()) / 1000));
        if(this.timeLeft < 1) {

          if(this.quiz.attempts > 0) {
            this.submitQuiz();
          }  
        } 
        //console.log(this.timeLeft);
        this.setStartTime();
      }));
        
      });
    }));
  }

  save() {
    this.saving = true;
    const answers = [];

    this.quiz.items.forEach( (item: Item) => {
      answers.push({
        question: item.question,
        response: item.response,
      });
    });

    this.courseServices.saveResponses(this.userServices.user(), this.current_course, this.assessment_id, answers).subscribe( (resp) => {
      this.saving = false;
    });
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

      this.router.navigate(['/nav/courses/result'], { queryParams: {course: this.current_course, quiz: this.assessment_id } });
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
