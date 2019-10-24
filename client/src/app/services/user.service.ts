import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/toPromise';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, distinctUntilChanged, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { CookieService} from 'ngx-cookie-service';
import {stringify} from 'querystring';
import {placeholdersToParams} from '@angular/compiler/src/render3/view/i18n/util';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line:variable-name
  private student_id = '0'; // debugging value
  private isAdmin = true;
  private FBLoggedIn = true;

  constructor(private http: HttpClient) {
    // tslint:disable-next-line:only-arrow-functions
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '398974807682335',
        cookie     : true,
        xfbml      : true,
        version    : 'v4.0'
      });
      FB.AppEvents.logPageView();
    };

    // tslint:disable-next-line:only-arrow-functions
    (function(d, s, id) {
      // tslint:disable-next-line:one-variable-per-declaration prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
    // console.log('submit login to facebook');
    // FB.login();
    FB.login(result => {
        this.http.post(`${environment.apiAddress}/security/auth/facebook`, {access_token: result.authResponse.accessToken});
        // console.log('BEFORE IF', result.authResponse);
        // if (result.authResponse) {
        //   console.log('submitLogin', result.authResponse);
        //   const params = {params: new HttpParams().set('accessToken', `${result.authResponse.accessToken}`)};
        //   console.log('Params', params);
        //   return this.http.post(`${environment.apiAddress}/security/auth/facebook`, stringify(result.authResponse.accessToken));
        //   console.log('params');
        // if (params) {
        //         //   localStorage.setItem('id_token', stringify(params));
        //         // }
      }
    )};

    // FB.login((response) => {
    //   console.log('submitLogin', response.authResponse);
    //   this.http.post(`${environment.apiAddress}/security/auth/facebook`, {access_token: response.authResponse.accessToken});
    //   if (response.authResponse != null) {
    //     // console.log('HERE I AM AUTHRESPONSE');
    //     // const token = this.http.post(`${environment.apiAddress}/security/auth/facebook`, {access_token: response.authResponse.accessToken});
    //     // console.log('Token is', stringify(token));
    //     const token = ' ';
    //     if (token) {
    //       localStorage.setItem('id_token', stringify(token));
    //     } else {
    //       console.log('User login failed');
    //     }
    //   }
    // });

logout() {
    localStorage.removeItem('id_token');
  }

isLoggedIn() {
      this.getCurrentUser();
  }

getCurrentUser() {
      return this.http.get(`${environment.apiAddress}/security/auth/me`);
  }

// tslint:disable-next-line:variable-name
getStudentCourses(student_id: string) {
    const params = { params: new HttpParams().set('student', `${student_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-courses`, params);
  }

  /**
   *
   * @param student_id facebook id for this app's user
   * @param course_id course database id
   *
   * @returns boolean, is this student enrolled in this course
   */
  // tslint:disable-next-line:variable-name
studentHasCourse(student_id, course_id) {
    const params = { params: new HttpParams().set('student', `${student_id}`).set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-has-course`, params);
  }

  /**
   * DEBUGGING GETTER FOR DEBUG STUDENT
   */
user() {
    return this.student_id;
  }


getIsAdmin() {
    return this.isAdmin;
  }

fbLoggedIn() {
    return this.FBLoggedIn;
  }

toggleLoggedIn() {
    this.FBLoggedIn = !this.FBLoggedIn;
  }

  private handleError<T>(operation = 'operation', result ?: T) {
    return (err: any): Observable<T> => {
      throw err;
    };
  }
}
