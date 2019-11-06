import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnChanges {

  navs = [
    {val:'Home', ico: 'home'},
    {val:'Modules', ico:'view_module'},
    {val:'Grades', ico:'assessment'},
    {val:'Discussions', ico: 'forum'},
    {val: 'Roll Call', ico: 'forum'}];

  private navItem = 'Home';

  private subscriptions: Subscription[] = [];
  private user_id: string;
  private authorized = false;
  current_course = '';
  course = {name: '', id: this.current_course, description: '', instructor: ''};


  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadData();

    this.subscriptions.push(this.router.events.subscribe((e:any) => {
      if(e instanceof NavigationEnd) {
        this.loadData();
      }
    }));
  }

  loadData() {
    this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
      if(params.select) {
        this.navItem = params.select;
      }
      if(params.course) {
        this.current_course = params.course;
      }
    }));

    this.user_id = this.userServices.user();

    this.subscriptions.push(this.userServices.studentHasCourse(this.user_id, this.current_course).subscribe( (resp:boolean) => {
      this.authorized = resp;

      if(this.authorized || this.userServices.getIsAdmin()) {
        this.subscriptions.push(this.coursesServices
          .getCourseInfo(this.current_course)
          .subscribe( (course: {id: string, name:string, description: string, instructor: string, students: string[]}) => {
          this.course = course;
          //console.log(course);
        }));
      } else {
        this.router.navigateByUrl('/');
        //console.log("not authorized!");
      }

    }));
  }

  setNav(val: string) {
    this.navItem = val;
  }

  isEqual(val: string) {
    return this.navItem === val;
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }


}
