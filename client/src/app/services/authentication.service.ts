import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/users.models';
import { AuthData} from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<any>(`${environment.apiAddress}/users/admin-login`, authData)
      .subscribe(response => {
        console.log(response);
      });
  }
  //
  // login(email: string, password: string) {
  //   // const authData: AuthData = { email, password};
  //   return this.http.post<any>(`${environment.apiAddress}/users/admin-login`, { email, password})
  //     .subscribe(response => {
  //       const token = response.token;
  //       this.token = token;
  //       if (token) {
  //         const expiresInDuration = response.expiresIn;
  //         this.setAuthTimer(expiresInDuration);
  //         this.isAuthenticated = true;
  //         this.authStatusListener.next(true);
  //         const now = new Date();
  //         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
  //         console.log(expirationDate);
  //         this.saveAuthData(token, expirationDate);
  //         this.router.navigate(['/']);
  //       }
  //     });
  // }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}


//   private currentUserSubject: BehaviorSubject<User>;
//   public currentUser: Observable<User>;
//
//   constructor(private http: HttpClient) {
//     this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
//     this.currentUser = this.currentUserSubject.asObservable();
//   }
//
//   public get currentUserValue(): User {
//     return this.currentUserSubject.value;
//   }
//
//   login(username: string, password: string) {
//     return this.http.post<any>(`${environment.apiAddress}/auth/signin`, { username, password })
//       .pipe(map(user => {
//         if (user && user.token) {
//           user.role = JSON.parse(atob(user.token.split('.')[1])).role[0];
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           this.currentUserSubject.next(user);
//         }
//
//         return user;
//       }));
//   }
//
//   logout() {
//     // remove user from local storage to log user out
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }
//
// }
