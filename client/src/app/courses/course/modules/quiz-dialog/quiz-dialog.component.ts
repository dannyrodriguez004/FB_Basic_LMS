import { Router } from '@angular/router';
import { Item } from './../../../assessment/assessment.component';
import { CoursesService } from 'src/app/courses/courses.service';
import { UserService } from 'src/app/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';

export interface Record {
  title: string, 
  attempted: string, 
  doneOn: Date, 
  dueDate: Date, 
  outOf: string, 
  startTime: Date, 
  items: Item[],
  attempts: string,
};

@Component({
  selector: 'app-quiz-dialog',
  templateUrl: './quiz-dialog.component.html',
  styleUrls: ['./quiz-dialog.component.scss']
})
export class QuizDialogComponent implements OnInit {

  record: Record = {
    title: '',
    attempted: '0',
    doneOn: null,
    dueDate: null,
    outOf: '1',
    startTime: null,
    items: [],
    attempts: '1',
  };

  data: { module: string ,course: string, quiz: string} = {module: '', course: '', quiz: ''};

  isOpen: boolean = false;
  hasTaken: boolean = false;
  canTake: boolean = false;

  private serverTime: Date = null;

  constructor(
    public dialogRed: MatDialogRef<QuizDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) Data: { module: string ,course: string, quiz: string},
    private courseServices: CoursesService,
    private userServices: UserService,
    private router: Router,
  ) {
    this.data = Data;
    //console.log(this.data);
   }

  ngOnInit() {
    this.courseServices.getStudentQuizRecord(this.userServices.user(), this.data.course, this.data.quiz).subscribe( (resp: Record) => {
      this.record = resp;
      console.log(resp);

      this.courseServices.getQuizInfo(this.data.course, this.data.module, this.data.quiz).subscribe( (resp2: Record) => {
        this.record.attempts = resp2.attempts;
        this.record.dueDate = new Date(resp2.dueDate);
        

        this.courseServices.getServerTime().subscribe( (resp:Date) => {
          this.serverTime = new Date(resp);
          
          this.isOpen = this.serverTime.getTime() < this.record.dueDate.getTime();
          this.hasTaken = Number(this.record.attempted) > 0;
          this.canTake = Number(this.record.attempted) < Number(this.record.attempts);
          console.log(this.record.attempted);
        });
      });
      
    });
  }

  onNoClick() {
    this.dialogRed.close();
  }

  goToQuiz() {
    this.router.navigate(['/nav/courses/assessment'], { queryParams: {id: this.data.quiz, course: this.data.course, module: this.data.module} });
    this.dialogRed.close();
  }

  goToResult() {
    this.router.navigate(['/nav/courses/result'], { queryParams: {course: this.data.course, quiz: this.data.quiz } });
    this.dialogRed.close();
  }



}
