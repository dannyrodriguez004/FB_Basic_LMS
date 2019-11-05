import { Router } from '@angular/router';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { distinctUntilChanged, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CookieService} from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private student_id = '0'; // debugging value
  private admin: {id:string, name: string};
  private isAdmin = false;
  private auth = 0;
  private FBLoggedIn = true;

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router
    ) {
      this.isAdmin = this.cookies.check('admin-session') && this.isTokenFresh(this.cookies.get('admin-session'));
    }

    isTokenFresh(token: string): any {
      try {
          const decoded = jwt_decode(token);
          console.log(decoded);
          if (!decoded.exp) { throw false; }
          this.auth = decoded.auth;
          this.admin = {id: decoded.id, name: decoded.name};
          if (decoded.exp < Date.now().valueOf() / 1000) {
            throw false;
          } else {
            return true;
          }
  
      } catch (err) {
          return err;
      }
  }

  getAdmin() {
    return this.admin;
  }

  Adminlogin(loginData) {
    let options = new HttpParams();
    options = options.append('username', loginData.username);
    options = options.append('password', loginData.password);
    return this.http.post(`${environment.apiAddress}/users/admin-login`, loginData).pipe(
      distinctUntilChanged(),
      tap((jwt: any) => {
        this.cookies.set('admin-session', jwt.payload, 2, '/');
        this.isAdmin = true;
        const decoded = jwt_decode(jwt.payload);
        this.auth = decoded.auth;

      }),
      catchError(this.handleError('adminLogin'))
    );
  }

  logOutUser() {
    if(this.cookies.getAll() != {}){
      this.cookies.deleteAll('/');
    }
    this.isAdmin = false;
    this.auth = -1;
    this.router.navigate(['/nav/home']);
  }
  /**
   *
   * @param student_id facebook id for this app's user
   *
   * @returns {course_id: string, name: string}[]
   */
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
  studentHasCourse(student_id, course_id) {
    const params = { params: new HttpParams().set('student', `${student_id}`).set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-has-course`, params);
  }

  isUsernameAvailable(username) {
    return this.http.post(`${environment.apiAddress}/users/available-username`, {username})
  }

  addInstructor(user) {
    return this.http.post(`${environment.apiAddress}/users/add-instructor`, {user})
  }

  addStudent(user) {
    return this.http.post(`${environment.apiAddress}/users/add-student`, {user});
  }

  isStudent(student) {
    return true;
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

  getAuth() {
    return this.auth;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      throw err;
    };
  }
}
