import { CoursesService } from 'src/app/services/courses.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

  private stars = [true,true,true];

  constructor(
    public dialogRef: MatDialogRef<PracticeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) Data: {course: string, module: string, contId: string},
    private courseServices: CoursesService,
  ) { }

  quiz = {
    title: 'quiz',
    items: [
      {question: '1+1=?', answer: 1, options: ['0', '2', '4', '11']},
      {question: '2+2=?', answer: 2, options: ['0', '2', '4', '11']},
      {question: '4*2=?', answer: 1, options: ['8', '12', '44', '11']},
      {question: '1*1=?', answer: 1, options: ['1', '5', '0', '11']},
    ]
  };

  ngOnInit() {
  }

  getStarts() {
    return this.stars;
  }

}
