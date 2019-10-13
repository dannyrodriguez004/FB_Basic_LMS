import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatTableModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatStepperModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatDividerModule
} from '@angular/material';

import { CoursesRoutingModule } from './courses-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { ModulesComponent } from './course/modules/modules.component';
import { GradesComponent } from './course/grades/grades.component';
import { DiscussionsComponent } from './course/discussions/discussions.component';
import { InfoComponent } from './course/info/info.component';
import { DiscussionComponent } from './course/discussion/discussion.component';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { AngularEditorModule} from '@kolkov/angular-editor';
import { AssessmentComponent } from './assessment/assessment.component';
import { DiscussionEditorComponent } from './course/discussion/discussion-editor/discussion-editor.component';
import { NewDiscussionComponent } from './course/discussions/new-discussion/new-discussion.component';
import { CourseDetailEditorComponent } from './course/info/course-detail-editor/course-detail-editor.component';
import { NewContentComponent } from './course/modules/new-content/new-content.component';
import { ModuleEditorComponent } from './course/modules/module-editor/module-editor.component';
import { NewExternalLinkComponent } from './course/modules/new-content/new-external-link/new-external-link.component';
import { NewEmbeddedVideoComponent } from './course/modules/new-content/new-embedded-video/new-embedded-video.component';
import { NewPageComponent } from './course/modules/new-content/new-page/new-page.component';
import { NewQuizComponent } from './course/modules/new-content/new-quiz/new-quiz.component';
import { DocumentViewerComponent } from './course/document-viewer/document-viewer.component';
import { RollcallComponent } from './course/rollcall/rollcall.component';
import { PagesComponent } from './course/pages/pages.component';
import { ConfirmEnrollComponent } from './course/confirm-enroll/confirm-enroll.component';
import { EnrollDialogComponent } from './course/confirm-enroll/enroll-dialog/enroll-dialog.component';



@NgModule({
  declarations: [
    CourseComponent,
    CoursesComponent,
    ModulesComponent,
    GradesComponent,
    DiscussionsComponent,
    InfoComponent,
    DiscussionComponent,
    AssessmentComponent,
    DiscussionEditorComponent,
    NewDiscussionComponent,
    CourseDetailEditorComponent,
    NewContentComponent,
    ModuleEditorComponent,
    NewExternalLinkComponent,
    NewEmbeddedVideoComponent,
    NewPageComponent,
    NewQuizComponent,
    DocumentViewerComponent,
    RollcallComponent,
    PagesComponent,
    ConfirmEnrollComponent,
    EnrollDialogComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    AngularEditorModule,
    FormsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    NgxDocViewerModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  entryComponents: [
    DiscussionEditorComponent,
    NewDiscussionComponent,
    CourseDetailEditorComponent,
    ModuleEditorComponent,
    NewContentComponent,
    EnrollDialogComponent
  ]
})
export class CoursesModule { }
