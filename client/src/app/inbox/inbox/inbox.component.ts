import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CoursesService} from '../../services/courses.service';
import {DiscussionsComponent} from '../../courses/course/discussions/discussions.component';
import {Conversation, Discussion, DIscussions} from '../../models/courses.models';
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

  private navItem = 'Conversation';
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
    this.loadConversations();
    console.log(this.conversations);
    //
    // this.subscriptions.push(this.router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    //     this.loadConversation();
    //   }
    // }));
  }

  loadData() {
    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
      if (params.select) {
        this.navItem = params.select;
      }
      if (params.course) {
        this.current_course = params.course;
      }
    }));
    this.user_id = this.userServices.fbUser().id;
    console.log(this.user_id);
    if (this.userServices.getIsAdmin()) {
      this.subscriptions.push(this.coursesServices
        .getCourseInfo(this.current_course)
        .subscribe((course: {
          id: string, name: string,
          description: string, instructor: string, students: string[]
        }) => {
          this.course = course;
        }));
    } else if (this.user_id) {
      this.subscriptions.push(this.coursesServices
        .getCourseInfo(this.current_course)
        .subscribe((course: {
          id: string, name: string,
          description: string, instructor: string, students: string[]
        }) => {
          this.course = course;
        }));
    }
  }

  loadConversations() {
    this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: Conversation[]) => {
      this.conversations = resp;
      console.log(this.conversations);
    }));
    // this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
    //   if (params.select) {
    //     this.navItem = params.select;
    //   }
    //   if (params.course) {
    //     this.currentConversation = params.conversation;
    //   }
    // }));
    // this.user_id = this.userServices.fbUser().id;

  }

  setNav(val: string) {
    this.navItem = val;
  }

  async onSetCurrentConversation(c: any) {
    console.log(c);
    this.coursesServices.getDiscussionInfo(c.courseId, c.id).subscribe( (result) => {
      console.log(result);
    });
    this.currentConversation = c;
  }

  isEqual(val: string) {
    return this.navItem === val;
  }

  ngOnChanges() {
    this.ngOnInit();
  }

}
