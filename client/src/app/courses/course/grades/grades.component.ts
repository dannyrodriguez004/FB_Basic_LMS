import { Subscription } from 'rxjs';
import { CoursesService } from '../../courses.service';
import { UserService } from '../../../user.service';
import { Component, OnInit, Input } from '@angular/core';

export interface Record {
  id: string;
  title: string;
  dueDate: string;
  doneOn: string;
  score: number;
  outOf: number;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {


  @Input('current_course') current_course: string;

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
    this.loadGrades();
  }


  loadGrades() {
    this.loading = true;
    this.subscriptions.push(this.coursesServices.getStudentCourseGrades(this.current_course, this.debugUser).subscribe( (resp: Record[]) => {
      this.dataSource = resp;
      this.loading = false;
    }));

  }

  getPercent() {
    var total = this.dataSource.map( data => data.outOf).reduce( (acc , value) => (acc + value), 0.0);
    if(total < 0) return 0;
    return this.dataSource.map( data => data.score).reduce( (acc , value) => (acc + value), 0.0) / total;
  }

}
