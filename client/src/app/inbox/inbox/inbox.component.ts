import {Component, OnChanges, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CoursesService} from '../../services/courses.service';
import {DiscussionsComponent} from '../../courses/course/discussions/discussions.component';
import {DIscussions} from "../../models/courses.models";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnChanges {

  conversations: DIscussions[] = []
  navs = [
    {val: 'Conversation', ico: 'forum'}
    ];

  private navItem = 'Conversation';
  currentConversation = '';
  conversation = {id: ''};
  private user_id: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router
  ) { }

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
    this.subscriptions.push(this.coursesServices.getConversations().subscribe( (resp: DIscussions[]) => {
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
