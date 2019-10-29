import { Router } from '@angular/router';
import { Item } from './../../../assessment/assessment.component';
import { CoursesService } from '../../../../services/courses.service';
import { AdminService } from '../../../../services/admin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';

export interface Record {
  title: string;
  attempted: string;
  doneOn: Date;
  dueDate: Date;
  outOf: string;
  startTime: Date;
  items: Item[];
  attempts: string;
}

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

  data: { module: string , course: string, quiz: string} = {module: '', course: '', quiz: ''};

  isOpen = false;
  hasTaken = false;
  canTake = false;

  private serverTime: Date = null;

  constructor(
    public dialogRed: MatDialogRef<QuizDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) Data: { module: string , course: string, quiz: string},
    private courseServices: CoursesService,
    private adminServices: AdminService,
    private router: Router,
  ) {
    this.data = Data;
    // console.log(this.data);
   }

  ngOnInit() {
    this.courseServices.getStudentQuizRecord(this.adminServices.user(), this.data.course, this.data.quiz).subscribe( (resp: Record) => {
      this.record = resp;
      console.log(resp);

      this.courseServices.getQuizInfo(this.data.course, this.data.module, this.data.quiz).subscribe( (resp2: Record) => {
        this.record.attempts = resp2.attempts;
        this.record.dueDate = new Date(resp2.dueDate);


        // tslint:disable-next-line:no-shadowed-variable
        this.courseServices.getServerTime().subscribe( (resp: Date) => {
          this.serverTime = new Date(resp);

          this.isOpen = this.serverTime.getTime() < this.record.dueDate.getTime();
          this.hasTaken = Number(this.record.attempted) > 0;
          // tslint:disable-next-line:triple-equals
          this.canTake = Number(this.record.attempted) < Number(this.record.attempts) || this.record.attempts == 'unlimited';
          console.log(this.record.attempted);
        });
      });

    });
  }

  onNoClick() {
    this.dialogRed.close();
  }

  goToQuiz() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/nav/courses/assessment'], { queryParams: {id: this.data.quiz, course: this.data.course, module: this.data.module} });
    this.dialogRed.close();
  }

  goToResult() {
    this.router.navigate(['/nav/courses/result'], { queryParams: {course: this.data.course, quiz: this.data.quiz } });
    this.dialogRed.close();
  }



}
