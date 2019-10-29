/* Angular */
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

/* Styling */
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

/* Services */
import { UserService } from './services/user.service';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

/* App Components */
import { AppComponent } from './app.component';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';

/* Unused */
import { NewContentComponent } from './courses/course/modules/new-content/new-content.component';
import { ModuleEditorComponent } from './courses/course/modules/module-editor/module-editor.component';
import { CourseDetailEditorComponent } from './courses/course/info/course-detail-editor/course-detail-editor.component';
import { DiscussionEditorComponent } from './courses/course/discussion/discussion-editor/discussion-editor.component';
import { NewDiscussionComponent } from './courses/course/discussions/new-discussion/new-discussion.component';
import { NewcourseComponent } from './nav/newcourse/newcourse.component';


import { CookieService } from 'ngx-cookie-service';
import { JwtTokenInterceptorService } from './jwt-token.interceptor';
import {EnsureHttpsInterceptorModule} from 'angular-interceptors';
import {ToastrModule} from 'ngx-toastr';


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
    MatDialogModule,
    // ToastrModule.forRoot(),
    EnsureHttpsInterceptorModule.forRoot()
  ],
  providers: [
    UserService,
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [YesNoDialogComponent],
})
export class AppModule { }
