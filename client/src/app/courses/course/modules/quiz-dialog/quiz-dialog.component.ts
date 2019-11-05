import { Router } from '@angular/router';
import { Item } from './../../../assessment/assessment.component';
import { CoursesService } from '../../../courses.service';
import { AdminService } from '../../../../admin.service';
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

  noDueDate = false;
  loading = false;

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
    this.loading = true;
    this.courseServices.getStudentQuizRecord(this.adminServices.user(), this.data.course, this.data.quiz).subscribe( (resp: Record) => {
      this.record = resp;
      this.courseServices.getQuizInfo(this.data.course, this.data.module, this.data.quiz).subscribe( (resp2: Record) => {
        this.record.attempts = resp2.attempts;
        this.record.dueDate = new Date(resp2.dueDate);
        if (resp2.dueDate === undefined) {
          this.noDueDate = true;
        }
        this.record.dueDate = resp2.dueDate ? new Date(resp2.dueDate) : new Date('01/31/9999');
        this.courseServices.getServerTime().subscribe( (response: Date) => {
          this.serverTime = new Date(response);
          this.isOpen = this.serverTime.getTime() < this.record.dueDate.getTime();
          this.hasTaken = Number(this.record.attempted) > 0;
          this.canTake = Number(this.record.attempted) < Number(this.record.attempts) || this.record.attempts === 'unlimited';
          this.loading = false;
        });
      });

    });
  }

  onNoClick() {
    this.dialogRed.close();
  }

  goToQuiz() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/nav/courses/assessment'], { queryParams:
        {id: this.data.quiz, course: this.data.course, module: this.data.module} });
    this.dialogRed.close();
  }

  goToResult() {
    this.router.navigate(['/nav/courses/result'], { queryParams:
        {course: this.data.course, quiz: this.data.quiz } });
    this.dialogRed.close();
  }

  getDueDate() {
    return !this.noDueDate ? new Date(this.record.dueDate).toLocaleString() : 'No due Date';
  }


}
