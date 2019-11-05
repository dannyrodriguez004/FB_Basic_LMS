import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenInterceptorService } from './jwt-token.interceptor';
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
  providers: [
    UserService, 
    CookieService, 
    {provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [YesNoDialogComponent],
})
export class AppModule { }
