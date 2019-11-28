import { MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { CoursesService } from '../../../services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NewContentComponent } from './new-content/new-content.component';
import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { QuizDialogComponent } from './quiz-dialog/quiz-dialog.component';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  // tslint:disable-next-line:variable-name no-input-rename
  @Input('current_course') current_course: string;
  loading = true;
  modules = [];
  subscriptions: Subscription[] = [];
  showVideo = false;
  contentEmbedded = '';
  safeURL: SafeResourceUrl;
  openVid: {module: string, content: number} =  {module: null, content: -1};
  constructor(
    private coursesServices: CoursesService,
    private userServices: UserService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    // this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(videoURL)
  }

  openNewContentDialog(selectModule) {

    const dialogRef = this.dialog.open(NewContentComponent, {
      width: '90%',
      data: {
        course: this.current_course,
        current_module: selectModule
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.ngOnInit();
        console.log(result);
      }
    }));
  }

  openVideo(videoURL, module, contentID, title) {
    this.openVid.module = module;
    this.openVid.content = contentID;
    let el = document.getElementById( 'videoDiv-' + this.openVid.module + this.openVid.content + title);
    if (el) {
      if (el.style.display === 'inline') {
        this.closeVideo(title);
      } else {
        el.style.display = 'inline';
      }
    }
    this.showVideo = true;
    // this.contentEmbedded = videoURL;
    this.safeURL = videoURL;
  }

  closeVideo(title) {
    let el = document.getElementById( 'videoDiv-' + title);
    el.style.display = 'none';
  }

  openEditModuleDialog(courseModule) {

    console.log(courseModule);
    const dialogRef = this.dialog.open(ModuleEditorComponent, {
      width: '90%',
      data: {module: courseModule, course_id: this.current_course}
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.ngOnInit();
      }
    }));
  }

  openQuizDialog(courseModule, quiz) {

    const dialogRef = this.dialog.open(QuizDialogComponent, {
      // width: '90%',
      data: {
        module: courseModule,
        course: this.current_course,
        quiz
      },
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {

    }));
  }

  openInNewTab(url) {
    window.open(url, '_blank');
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.coursesServices.getModules(this.current_course).subscribe( (resp: []) => {
      this.modules = resp;
      this.loading = false;
    }));
  }
}
