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
  public response = null;
  private disabled = false;
  private completed = false;
  private submitted = false;
  private correct = 0;

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

  select = {question: 'aaaaaaaa', answer: -1, options: ['','','','']};
  currentIndex = 0;

  ngOnInit() {
    this.select = this.quiz.items[0];
    console.log(this.select);
  }

  getStarts() {
    return this.stars;
  }

  private removeStar() {
    this.stars.pop();
  }

  submit() {
    if(this.response == this.select.answer) {
      this.correct++;
      this.disabled = true;
    } else {
      document.getElementById(this.response).style.color = 'red';
      this.disabled = true;
      this.removeStar();
    }

    document.getElementById(`${this.select.answer}`).style.color = 'green';

    
    this.submitted = true;
    
  }

  canNext() {
    return this.quiz.items.indexOf(this.select) < (this.quiz.items.length - 1) && this.stars.length > 0;
  }

  next() {
    this.response = null;
    this.select = this.quiz.items[++this.currentIndex];
    this.disabled = false;
    this.submitted = false;

    for(let i = 0; i < this.quiz.items.length; i++) {
      document.getElementById(`${i}`).style.color = 'black';
    }

  }

  isDisabled() {
    return this.disabled;
  }

  close() {
    this.dialogRef.close();
  }

  isDone() {
    return this.completed;
  }

  isSubmitted() {
    return this.submitted;
  }

  result() {
    if(!this.canNext()) this.completed = true;
  }

  getPercent() {
    if(this.quiz.items.length < 1) return 0;

    return (this.correct / this.quiz.items.length) * 100;
  }

  getCorrect() {
    return this.correct;
  }

}
