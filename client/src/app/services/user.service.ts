import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line:variable-name
  private student_id = '0'; // debugging value
  private isAdmin = true;
  private FBLoggedIn;

  constructor(private http: HttpClient) {
    const jwtToken = this.getToken();
    this.FBLoggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    // tslint:disable-next-line:only-arrow-functions
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId: '398974807682335',
        cookie: true,
        xfbml: true,
        version: 'v4.0'
      });
      FB.AppEvents.logPageView();
    };

    // tslint:disable-next-line:only-arrow-functions
    (function(d, s, id) {
      // tslint:disable-next-line:one-variable-per-declaration prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  getToken(): string {
    return window.localStorage.jwtToken;
  }

  saveToken(token: string) {
    window.localStorage.jwtToken = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  buildHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (this.getToken()) {
      headersConfig['Authorization'] = `Token ${this.getToken()}`;
    }

    return new HttpHeaders(headersConfig);
  }

  submitLogin() {
    FB.login(result => {
      const params = {params: new HttpParams().set('userID', result.authResponse.userID)};
      console.log('BEFORE IF', result.authResponse);
      if (result.authResponse) {
        this.http.post(`${environment.apiAddress}/security/auth/facebook`, params)
          .subscribe((response: any) => {
            this.FBLoggedIn = true;
            console.log('POST RESPONSE', response);
            this.saveToken(response.token);
            console.log('submitLogin', result.authResponse);
            console.log('params', params);
            if (params) {
              localStorage.setItem('id_token', stringify(params));
            } else {
              console.log('NO RESPONSE');
            }
          });
      }
    });
  }


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
    console.log('StudentID: ' + student_id);
    const opts = {
      params: new HttpParams().set('student', `${student_id}`),
      headers: this.buildHeaders()
    };
    return this.http.get(`${environment.apiAddress}/courses/student-courses`,
      opts);
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
