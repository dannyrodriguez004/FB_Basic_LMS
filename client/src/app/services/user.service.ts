import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { distinctUntilChanged, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line:variable-name
  private student_id = '0'; // debugging value
  private isAdmin = false;
  private FBLoggedIn = true;

  constructor(
    private http: HttpClient,
    private cookies: CookieService
    ) {
      this.isAdmin = this.cookies.check('admin-session');
      //console.log(this.cookies.getAll());
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
      }),
      catchError(this.handleError('adminLogin'))
    );
  }

  logOutUser() {
    // tslint:disable-next-line:triple-equals
    if (this.cookies.getAll() != {}) {
      this.cookies.deleteAll('/');
    }
    this.isAdmin = false;
  }
  /**
   *
   * @param student_id facebook id for this app's user
   *
   * @returns {course_id: string, name: string}[]
   */
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      throw err;
    };
  }
}
