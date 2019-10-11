import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  getCourseInfo(course_id) {
    const params = { params: new HttpParams().set('key',`${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-info`, params);
  }

  getDiscussions(course_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussions`, params);
  }

  getModules(course_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/modules`, params);
  }

  getDiscussionPosts(course_id, discussion_id, startFrom) {
    const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`).set('start',`${startFrom}`)};
    return this.http.get(`${environment.apiAddress}/courses/discussion-posts-from`, params);
  }

  getDiscussionInfo(course_id, discussion_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussion-info`, params);
  }

  getPage(course_id, module_id, page_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`).set('module', `${module_id}`).set('page', `${page_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/page`, params)
  }

  getStudentCourseGrades(course_id, student_id) {
    const params = { params: new HttpParams().set('course', `${course_id}`).set('student', `${student_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-grades`, params);
  }

  getInstructorInfo(instructor_id) {
    const params = { params: new HttpParams().set('id', `${instructor_id}`)};
    return this.http.get(`${environment.apiAddress}/users/instructor-info`, params);
  }

  getAllInstructors() {
    return this.http.get(`${environment.apiAddress}/users/all-instructors`);
  }

  postDiscussionPost(course_id, discussion_id, post) {
    //const params = { params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`).set('post', `${post}`)};
    return this.http.post(`${environment.apiAddress}/courses/add-discussion-post`, {course: course_id, discussion: discussion_id, post: post});
  }

  updateCourse(course) {
    //const params = { params: new HttpParams().set('course', `${course}`)};
    return this.http.post(`${environment.apiAddress}/courses/update-course`, {course: course});
  }

  newDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/add-course-discussion`, {course: course, discussion: discussion});
  }

  newContentPush(course, module_id, content) {
    return this.http.post(`${environment.apiAddress}/courses/add-module-content`, {course: course, module: module_id, content: content });
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

  getRegistered(course) {
    const params = { params: new HttpParams().set('course', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/registered-students`, params);
  }

}
