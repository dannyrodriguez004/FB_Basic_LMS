import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CoursesService} from '../../services/courses.service';
import {DiscussionsComponent} from '../../courses/course/discussions/discussions.component';
import {Conversation, CourseNav, Discussion, DIscussions} from '../../models/courses.models';
import {NewDiscussionComponent} from '../../courses/course/discussions/new-discussion/new-discussion.component';
import {MatDialog} from '@angular/material/dialog';
import {NewMessageComponent} from './new-message/new-message.component';
import {NewConversationComponent} from "./conversation/new-conversation/new-conversation.component";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnChanges {

  conversations: Conversation[] = [];
  currentConversation: Conversation;
  conversation = {id: ''};
  private user_id: string;
  current_course = '';
  course = {name: '', id: this.current_course, description: '', instructor: ''};
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  openConversationDialog() {
    this.loadData();
    const dialogRef =  this.dialog.open(NewMessageComponent, {
      width: '90%',
      data: this.conversation
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.loadConversations();
        console.log(result);
      }
    }));
  }

  ngOnInit() {
    this.loadData();
    this.loadConversations();
    console.log(this.conversations);
  }

  loadData() {
    this.user_id = this.userServices.fbUser().id;
    if (this.user_id) {
      this.subscriptions.push(this.coursesServices.getCourseInfo(this.current_course).subscribe((course: {
          id: string, name: string, description: string, instructor: string, students: string[]}) => {
          this.course = course;
          console.log(this.course);
        }));
    }
  }

  loadConversations() {
    console.log(this.course.name);
    this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: Conversation[]) => {
      this.conversations = resp;
      console.log(this.conversations);
    }));
  }

  async onSetCurrentConversation(c: any) {
    console.log(c);
    this.coursesServices.getDiscussionInfo(c.courseId, c.id).subscribe( (result) => {
      console.log(result);
    });
    // this.subscriptions.push(this.coursesServices.getCourseInfo(c.courseId).subscribe( (course: {id: string, name: string,
    //   description: string, instructor: string, students: string[]}) => {
    //   console.log(this.course);
    //   this.currentConversation.course_name = course.name;
    // }));
    // console.log(this.currentConversation.course_name);
    this.currentConversation = c;
    console.log(this.currentConversation);
  }

  ngOnChanges() {
    this.ngOnInit();
  }

}
