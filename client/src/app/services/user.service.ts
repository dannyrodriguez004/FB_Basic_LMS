import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';
import {BehaviorSubject} from 'rxjs';
import {UserModel} from '../models/usermodel.models';
import {EnrollDialogComponent} from '../courses/course/confirm-enroll/enroll-dialog/enroll-dialog.component';

declare var FB: any;
declare var window: any;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line:variable-name
  // private student_id = '0'; // debugging value
  private studentID: string;
  private isAdmin = false;
  private FBLoggedIn;
  private userModel: UserModel;

  constructor(private http: HttpClient) {
    const jwtToken = this.getToken();
    this.FBLoggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    window.fbAsyncInit = () => {
      FB.init({
        appId: '398974807682335',
        cookie: true,
        xfbml: true,
        version: 'v4.0'
      });
      FB.AppEvents.logPageView();
    };
    // tslint:disable-next-line:only-arrow-functions
    ( function(d, s, id) {
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
    // tslint:disable-next-line:only-arrow-functions

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
      Accept: 'application/json',
      Authorization: 'application/json'
    };

    if (this.getToken()) {
      headersConfig.Authorization = `Token ${this.getToken()}`;
    }
    return new HttpHeaders(headersConfig);
  }

  submitLogin() {
    FB.login(result => {
      console.log(result);
      const params = {params: new HttpParams().set('userID', result.authResponse.userID)};
      console.log('BEFORE IF', result.authResponse);
      FB.api('/me', {fields: 'first_name, last_name, email'}, response => {
            console.log(response);
        // console.log('Good to see you, ' + response.first_name + '  ' + response.last_name + '    .' + response.email);
        // console.log('ADDRESS: ' + response.user_location);
      });
      if (result.authResponse) {
        this.http.post(`${environment.apiAddress}/security/auth/facebook`, params)
          .subscribe((response: any) => {
            this.FBLoggedIn = true;
            console.log('POST RESPONSE', response);
            this.saveToken(response.token);
            if (params) {
              localStorage.setItem('id_token', stringify(params));
              console.log(params);
            } else {
              console.log('NO RESPONSE');
            }
            return this.redirectStudent(response.user);
          });
      }
    }, {scope: 'email', return_scopes: true});

  }


  // addUser(userModel) {
  //   this.existingStudent().subscribe( (resp: boolean) => {
  //     if (resp) {
  //       this.getCurrentUser().subscribe((response: any) => {
  //         this.userModel = response.user_info;
  //         const opts = {
  //           headers: this.buildHeaders(),
  //           params: ({
  //           id: userModel.id,
  //           email: userModel.email,
  //           first_name: userModel.first_name,
  //           last_name: userModel.last_name,
  //           address: userModel.address,
  //           phone: ''
  //         })
  //         };
  //         console.log(opts);
  //         return this.http.post(`${environment.apiAddress}/users/add-user`, opts);
  //       });
  //     } else {
  //       console.log('ERROR IN ADDUSER');
  //     }
  //   });
  // }

  redirectStudent(user) {
    console.log('IN REDIRECT STUDENT');
    console.log(user);
    this.existingStudent(user).subscribe((resp: boolean) => {
      console.log(resp);
      if (resp) {
        this.getCurrentUser().subscribe((response: any) => {
          console.log('IN REDIRECT STUDENT -> GET CURRENT USER   ', response);
          this.studentID = response.userID;
          this.userModel = response.user_info;
          if (!response.userID) {
            console.log('USER INFO CANNOT BE FOUND');
          } else {
            console.log(this.studentID);
            console.log('USER', this.userModel);
          }
        });
      }
      return this.addUser(this.userModel);
    });
  }

  addUser(userModel) {
    console.log('IN ADD USER   ', userModel);
    const opts = {
      headers: this.buildHeaders(),
      params: ({
        // id: userModel.id,
        email: userModel.email,
        first_name: userModel.first_name,
        last_name: userModel.last_name,
        address: userModel.address,
        phone: '',
        country: userModel.country
      })
    };
    console.log(opts);
    return this.http.post(`${environment.apiAddress}/users/add-user`, opts);
  }

  existingStudent(user) {
    const opts = {
      headers:  this.buildHeaders(),
      userID: user
    }
    console.log('IN EXISTING STUDENT', user)
    return this.http.post(`${environment.apiAddress}/users/existing-student`, opts);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.destroyToken();
  }

  isLoggedIn() {
      return this.getCurrentUser();
  }

  getCurrentUser() {
  const opts = {
    headers: this.buildHeaders()
  };
  console.log(opts);
  return this.http.get(`${environment.apiAddress}/security/auth/me`, opts);
}

// tslint:disable-next-line:variable-name
  getStudentCourses(student_id: string) {
    const opts = {
      headers: this.buildHeaders()
    };
    console.log('StudentID: ' + student_id);
    return this.http.get(`${environment.apiAddress}/courses/student-courses`,
      opts);
  }

  user() {
    return this.studentID;
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
