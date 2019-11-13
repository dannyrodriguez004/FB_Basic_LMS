import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IPost} from '../../../models/courses.models';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CoursesService} from '../../../services/courses.service';
import {UserService} from '../../../services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {DiscussionEditorComponent} from '../../../courses/course/discussion/discussion-editor/discussion-editor.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  // discussion variables
  id: string;                 // discussin id
  title: string;              // discussion title
  description: string;        // discussion description HTML format
  posts: IPost[] = [];         // discussion posts
  isClosed = false;   // discussion isClosed
  today: Date = new Date();
  endDate: Date = this.today;

  // pagination variables
  totalExchanges = 0;
  startFrom = 0;

  // rich text editor input
  replying = false;
  htmlContent = '';

  loading = true;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  // tslint:disable-next-line:no-input-rename
  @Input('currentConversation') currentConversation: string;
  constructor(
    private route: ActivatedRoute,
    private coursesServices: CoursesService,
    private userServices: UserService,
    private router: Router,
  ) {}

  ngOnInit() {

    this.loading = true;

    this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
      if (params.message) {
        this.id = params.message;
      }
      if (params.start) {
        this.startFrom = Number(params.start);
      }
    }));

    this.loadDiscussion();
    this.subscriptions.push(this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loading = true;

        this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
          if (params.message) {
            this.id = params.message.id;
          }

          if (params.start) {
            this.startFrom = Number(params.start);
          } else {
            this.startFrom = 0;
          }
        }));

        this.loadDiscussion();
      }
    }));
  }

  sendMessage() {
    const message = {
      user_id: this.userServices.fbUser().id,
      user_name: this.userServices.fbUser().first_name + ' ' + this.userServices.fbUser().last_name,
      date: new Date().getTime(),
      post: this.htmlContent};

    // this.subscriptions.push(this.coursesServices.sendMessage(this.currentConversation, this.id, message).subscribe( (resp) => {
    //   console.log(resp);
    //   if (resp) {
    //     this.totalExchanges++;
    //   }
    // }));
  }

  loadDiscussion() {
    this.loading = true;
    this.replying = false;
    this.htmlContent = '';

    // this.subscriptions.push(this.coursesServices.getMessageInfo(this.currentConversation, this.id)
    //   .subscribe( (resp: {title: any, description: any, isClosed: any, endDate: string}) => {
    //     this.description = resp.description;
    //     this.title = resp.title;
    //     this.isClosed = resp.isClosed;
    //     this.endDate = new Date(resp.endDate);
    //   }));
    //
    // // tslint:disable-next-line:max-line-length
    // this.subscriptions.push(this.coursesServices.getMessages(this.currentConversation, this.id, this.startFrom)
    //   .subscribe( (resp: {posts: IPost[], total: number}) => {
    //     if (resp.posts.length > 0) {
    //       this.posts = resp.posts;
    //       this.totalExchanges = resp.total;
    //     }
    //     this.loading = false;
    //   }));

  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  closeEditor() {
    this.replying = false;
  }

  isMessageEmpty() {
    return this.htmlContent === '';
  }

}

