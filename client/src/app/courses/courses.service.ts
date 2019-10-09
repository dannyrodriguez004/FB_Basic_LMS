/* tslint:disable:variable-name */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  getCourseInfo(course_id) {
    const params = { params: new HttpParams().set('key', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-info`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussions(course_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussions`, params);
  }

  // tslint:disable-next-line:variable-name
  getModules(course_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/modules`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussionPosts(course_id, discussion_id, startFrom) {
    // tslint:disable-next-line:max-line-length
    const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`).set('start', `${startFrom}`)};
    return this.http.get(`${environment.apiAddress}/courses/discussion-posts-from`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussionInfo(course_id, discussion_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussion-info`, params);
  }

  // tslint:disable-next-line:variable-name
  getPage(course_id, module_id, page_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`).set('module', `${module_id}`).set('page', `${page_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/page`, params);
  }

  getStudentCourseGrades(course_id, student_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`).set('student', `${student_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-grades`, params);
  }

  // tslint:disable-next-line:variable-name
  getInstructorInfo(instructor_id) {
    const params = { params: new HttpParams().set('id', `${instructor_id}`)};
    return this.http.get(`${environment.apiAddress}/users/instructor-info`, params);
  }

  getAllInstructors() {
    return this.http.get(`${environment.apiAddress}/users/all-instructors`);
  }

  getAllCategories() {
    return this.http.get(`${environment.apiAddress}/users/all-categories`);
  }

  getAllStudents() {
    return this.http.get(`${environment.apiAddress}/courses/student-has-course`);
  }

  // tslint:disable-next-line:variable-name
  postDiscussionPost(course_id, discussion_id, post) {
    // tslint:disable-next-line:max-line-length
    // const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`).set('post', `${post}`)};
    return this.http.post(`${environment.apiAddress}/courses/add-discussion-post`, {course: course_id, discussion: discussion_id, post});
  }

  updateCourse(course) {
    // const params = { params: new HttpParams().set('course', `${course}`)};
    return this.http.post(`${environment.apiAddress}/courses/update-course`, {course});
  }

  newDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/add-course-discussion`, {course, discussion});
  }

  addCourse(course) {
    return this.http.post(`${environment.apiAddress}/courses/add-course`, {course});

  }

  // tslint:disable-next-line:variable-name
  newContentPush(course, module_id, content) {
    return this.http.post(`${environment.apiAddress}/courses/add-module-content`, {course, module: module_id, content });
  }

  newQuizPush(course, module_id, quiz) {
    return this.http.post(`${environment.apiAddress}/courses/add-module-quiz`, {course: course, module: module_id, content: quiz });
  }

  newModule(course, newModule) {
    return this.http.post(`${environment.apiAddress}/courses/add-module`, {course: course, module: newModule});
  }

  removeContent(course, module_id, content) {
    return this.http.post(`${environment.apiAddress}/courses/remove-content`, {course: course, module: module_id, content: content});
  }

  getCourseModule(course, module_id) {
    const params = { params: new HttpParams().set('course', `${course}`).set('module', module_id)};
    return this.http.get(`${environment.apiAddress}/courses/course-module`, params);
  }

  updateDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/update-discussion`, {course: course, discussion: discussion});
  }

  deleteDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/remove-discussion`, {course: course, discussion: discussion});
  }

  getStudents(course_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-students`, params);
  }

}
