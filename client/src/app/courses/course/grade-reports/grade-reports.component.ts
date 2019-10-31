import { CoursesService } from '../../../services/courses.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, Input } from '@angular/core';


export interface Record {
  id: string;
  title: string;
  dueDate: string;
  doneOn: string;
  score: number;
  outOf: number;
  startTime: Date;
}

@Component({
  selector: 'app-grade-reports',
  templateUrl: './grade-reports.component.html',
  styleUrls: ['./grade-reports.component.scss']
})
export class GradeReportsComponent implements OnInit {

  @Input('current_course') current_course: string;

  student = '';
  students: {id: string, fname: string, lname: string}[] = [
    {id: '0', fname: 'Joao', lname: 'Guimaraes'},
    {id: '1', fname: 'Joao', lname: 'Guimaraes'},
    {id: '2', fname: 'Joao', lname: 'Guimaraes'},
    {id: '3', fname: 'Joao', lname: 'Guimaraes'},
    {id: '4', fname: 'Joao', lname: 'Guimaraes'},
    {id: '5', fname: 'Joao', lname: 'Guimaraes'},
  ];
  loading = true;

  private debugUser = this.userServices.user();
  private subscriptions: Subscription[] = [];

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    ) { }



  displayedColumns: string[] = ['title', 'dueDate', 'doneOn', 'score', 'outOf'];
  dataSource: Record[] = [];

  ngOnInit() {
    this.loadStudents();
    this.loadGrades();
  }

  loadStudents() {
    this.subscriptions.push(this.coursesServices.getCourseStudents(this.current_course).subscribe( (resp: {id: string, fname: string, lname: string}[]) => {
      this.students = resp;
      //console.log(resp);
    }));
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  loadGrades() {
    this.loading = true;
    this.subscriptions.push(this.coursesServices.getStudentCourseGrades(this.current_course, this.student).subscribe( (resp: Record[]) => {
      this.dataSource = resp;
      console.log(resp);
      this.loading = false;
    }));

  }

  getPercent() {
    var total = this.dataSource.map( data => data.outOf).reduce( (acc , value) => (acc + value), 0.0);
    if(total < 0) return 0;
    return this.dataSource.map( data => data.score).reduce( (acc , value) => (acc + value), 0.0) / total;
  }
}
