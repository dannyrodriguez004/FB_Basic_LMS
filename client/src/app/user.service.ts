import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private student_id = "haslhadsfapsjdfp"; // debugging value
  private isAdmin = true;
  private FBLoggedIn = true;

  constructor(private http: HttpClient) { }

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

  ToggleIsAdmin() {
    this.isAdmin = !this.isAdmin;
  }
}
