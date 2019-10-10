import { NewContentComponent } from './courses/course/modules/new-content/new-content.component';
import { ModuleEditorComponent } from './courses/course/modules/module-editor/module-editor.component';
import { CourseDetailEditorComponent } from './courses/course/info/course-detail-editor/course-detail-editor.component';
import { DiscussionEditorComponent } from './courses/course/discussion/discussion-editor/discussion-editor.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSortModule,
  MatSelectModule,
  MatDialogModule} from '@angular/material';
import { NewDiscussionComponent } from './courses/course/discussions/new-discussion/new-discussion.component';
import { NewcourseComponent } from './nav/newcourse/newcourse.component';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    YesNoDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    HomeModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
  entryComponents: [YesNoDialogComponent],
})
export class AppModule { }
