import { MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CoursesService } from '../../../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NewContentComponent } from './new-content/new-content.component';
import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { QuizDialogComponent } from './quiz-dialog/quiz-dialog.component';


@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  @Input('current_course') current_course: string;

  loading = true;

  modules = [];

  subscriptions: Subscription[] = [];

  constructor(
    private coursesServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,
    ) { }

  openNewContentDialog(sel_module) {

    const dialogRef = this.dialog.open(NewContentComponent, {
      width: '90%',
      data: {
        course: this.current_course,
        current_module: sel_module
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if(result) {
        this.ngOnInit();
        console.log(result);
      }
    }));
  }

  openEditModuleDialog(course_module) {

    console.log(course_module);
    const dialogRef = this.dialog.open(ModuleEditorComponent, {
      width: '90%',
      data: {module: course_module, course_id: this.current_course}
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if(result) {
        this.ngOnInit();
      }
      
    }));
  }

  openQuizDialog(course_module, quiz) {

    const dialogRef = this.dialog.open(QuizDialogComponent, {
      //width: '90%',
      data: {
        module: course_module, 
        course: this.current_course,
        quiz: quiz
      },
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {

    }));
  }


  openInNewTab(url) {
    window.open(url, "_blank");
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
  
  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.coursesServices.getModules(this.current_course).subscribe( (resp: []) => {
      this.modules = resp;
      this.loading = false;
      //console.log(resp);
    }));
  }

}
