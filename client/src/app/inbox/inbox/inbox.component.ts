import {Component, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CoursesService} from '../../services/courses.service';
import {DiscussionsComponent} from '../../courses/course/discussions/discussions.component';
import {Conversation, Discussion, DIscussions} from "../../models/courses.models";
import {NewDiscussionComponent} from "../../courses/course/discussions/new-discussion/new-discussion.component";
import {MatDialog} from "@angular/material/dialog";
import {NewMessageComponent} from "./new-message/new-message.component";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnChanges {

  conversations: Conversation[] = []

  private navItem = 'Conversation';
  currentConversation: Conversation;
  conversation = {id: ''};
  private user_id: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private dialog: MatDialog,

  ) { }

  openConversationDialog() {
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
    //
    // this.subscriptions.push(this.router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    //     this.loadConversation();
    //   }
    // }));
  }

  loadConversations() {
    this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: Conversation[]) => {
      this.conversations = resp;
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
    console.log(c)
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

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}
