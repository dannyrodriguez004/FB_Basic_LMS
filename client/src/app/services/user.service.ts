import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from '../models/usermodel.models';
import {Router} from '@angular/router';
import {catchError, distinctUntilChanged, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import {UsertypeModel} from '../models/usertype.model';

declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private isAdmin = false;


  private isLoggedIn = false;

  private FBLoggedIn;
  private userModel: UserModel = new UserModel();
  // tslint:disable-next-line:variable-name
  private student_id: string; // debugging value
  private admin: {id: string, name: string};
  private auth = 0;
  adminLoggedIn;



  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router) {
    // this.isAdmin = this.cookies.check('admin-session') && this.isTokenFresh(this.cookies.get('admin-session'));
    const jwtToken = this.getToken();
    this.FBLoggedIn = new BehaviorSubject<boolean>(!!jwtToken);
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: '398974807682335',
        cookie: true,
        xfbml: true,
        version: 'v4.0'
      });
      FB.AppEvents.logPageView();
      this.loadUser();
      if (!this.isLoggedIn) {
        //this.submitLogin();
      }
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

    console.log(this.userModel);
  }


  loadUser() {
    if (this.cookies.check('admin-session') && this.isTokenFresh(this.cookies.get('admin-session')) || this.isLoggedFacebookLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  isLoggedFacebookLoggedIn() {
    FB.getLoginStatus( (response) => {
      if (response.status === 'connected') {
        this.FBLoggedIn = true;
      } else {
        this.FBLoggedIn = false;
      }
      return this.FBLoggedIn;
    });
  }


  isTokenFresh(token: string) {
    try {
      const decoded = jwt_decode(token);
      if (!decoded.exp) { throw false; }
      console.log(decoded);
      this.auth = decoded.auth;

      if (decoded.exp < Date.now().valueOf() / 1000) {
        throw false;
      } else {
        const name: string[] = decoded.name.split(' ');
        console.log(name);
        this.userModel.id = decoded.id;
        this.userModel.first_name = name[0];
        this.userModel.last_name = name[1] || '';
        this.userModel.type = decoded.auth;

        console.log(this.userModel);

        return true;
      }
    } catch (err) {
      return err;
    }
  }

  // getAdmin() {
  //   return this.admin;
  // }

  Adminlogin(loginData) {
    let options = new HttpParams();
    options = options.append('username', loginData.username);
    options = options.append('password', loginData.password);
    return this.http.post(`${environment.apiAddress}/users/admin-login`, loginData).pipe(
      distinctUntilChanged(),
      tap((jwt: any) => {
        this.cookies.set('admin-session', jwt.payload, 2, '/');
        // this.isAdmin = true;
        this.isTokenFresh(jwt.payload);
        this.isLoggedIn = true;
      }),
      catchError(this.handleError('adminLogin'))
    );
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

  submitLogin() {
    FB.login(result => {
      console.log(result);
      const params = {params: new HttpParams().set('userID', result.authResponse.userID)};
      console.log('RESULT.AUTHRESPONSE:  ', result.authResponse);
      FB.api('/me', {fields: 'first_name, last_name, email'}, response => {
        console.log('this is the response:', response);
        this.userModel = {
          id: response.id,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          type: UsertypeModel.Student
        };
        console.log(this.userModel);
        console.log('Good to see you, ' + response.first_name + '  ' + response.last_name + '    .' + response.email);
      });
      if (result.authResponse) {
        this.http.post(`${environment.apiAddress}/security/auth/facebook`, params)
          .subscribe((response: any) => {
            this.FBLoggedIn = true;
            console.log('POST RESPONSE', response);
            this.saveToken(response.token);
          });
      }
    }, {scope: 'email', return_scopes: true});
  }

  getUserInfo(key) {
    const params = {params: new HttpParams().set('key', `${key}`)};
    return this.http.get(`${environment.apiAddress}/users/get-user-info`, params);
  }

  // redirectStudent(user) {
  //   console.log('IN REDIRECT STUDENT');
  //   console.log(user);
  //   this.existingStudent(user).subscribe((resp: boolean) => {
  //     console.log(resp);
  //     if (resp) {
  //       this.getCurrentUser().subscribe((response: any) => {
  //         console.log('IN REDIRECT STUDENT -> GET CURRENT USER   ', response);
  //         this.studentID = response.userID;
  //         this.userModel = response.user_info;
  //         if (!response.userID) {
  //           console.log('USER INFO CANNOT BE FOUND');
  //         } else {
  //           console.log(this.studentID);
  //           console.log('USER', this.userModel);
  //         }
  //       });
  //       return this.userModel;
  //     } else {
  //     // this.addUser(this.userModel);
  //     }
  //   });
  // }

  addUser(userModel) {
          const opts = {
            body: userModel
          };
          console.log(opts);
          // return this.http.post(`${environment.apiAddress}/users/add-user`, opts);
          this.http.post(`${environment.apiAddress}/users/add-user`, opts).subscribe((result: any) => {
      console.log(result);
    });
  }

  // existingStudent(user) {
  //   const opts = {
  //     headers:  this.buildHeaders(),
  //     userID: user
  //   };
  //   console.log('IN EXISTING STUDENT', opts);
  //   return this.http.post(`${environment.apiAddress}/users/existing-student`, opts);
  // }

  logout() {
    // tslint:disable-next-line:triple-equals
    if (this.cookies.getAll() != {}) {
      this.cookies.deleteAll('/');
    }

    this.userModel = new UserModel();
    this.isLoggedIn = false;

    console.log(this.userModel);
    // this.isAdmin = false;
    this.FBLoggedIn = false;
    this.auth = -1;
    this.router.navigate(['/nav/home']);
    localStorage.removeItem('id_token');
    this.destroyToken();
  }

  getIsLoggedIn() {
      return this.isLoggedIn;
  }

  getCurrentUser() {
  return this.http.get(`${environment.apiAddress}/security/auth/me`);
}

  getFbUserID() {
    this.getCurrentUser().subscribe((resp: any) => {
      console.log(resp);
      this.student_id = resp.userID;
      console.log(this.student_id);
    });
    return this.student_id;
  }

// tslint:disable-next-line:variable-name
//   getStudentCourses(student_id: string) {
//     const opts = {
//       headers: this.buildHeaders()
//     };
//     console.log('StudentID: ' + student_id);
//     return this.http.get(`${environment.apiAddress}/courses/student-courses`,
//       opts);
//   }

  isUsernameAvailable(username) {
    return this.http.post(`${environment.apiAddress}/users/available-username`, {username});
  }

  addInstructor(user) {
    return this.http.post(`${environment.apiAddress}/users/add-instructor`, {user});
  }

  addStudent(user) {
    return this.http.post(`${environment.apiAddress}/users/add-student`, {user});
  }

  fbUser() {
    return this.userModel;
  }

  user() {
    return this.getFbUserID();
    // return this.student_id;
  }

  getIsAdmin() {
    // return this.adminLoggedIn;
    return this.isLoggedIn && this.userModel.type < UsertypeModel.Guest;
  }

  fbLoggedIn() {
    return this.FBLoggedIn;
  }

  toggleLoggedIn() {
    this.FBLoggedIn = !this.FBLoggedIn;
  }

  getAuth() {
    return this.userModel.type;
  }

  private handleError<T>(operation = 'operation', result ?: T) {
    return (err: any): Observable<T> => {
      throw err;
    };
  }
}
