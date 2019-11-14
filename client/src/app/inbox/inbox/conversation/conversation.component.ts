import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Discussion, DIscussions, IPost, Message, Post} from '../../../models/courses.models';
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
  @Input('id') id: string;                 // discussion id
  @Input('courseId') courseId: string;     // course id
  @Input('title') title: string;           // discussion title
  description: string;                     // discussion description HTML format
  messages: Message[] = [];            // discussion posts
  today: Date = new Date();
  date: Date = this.today;

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
    const conversation = {
      user_id: this.userServices.fbUser().id,
      user_name: this.userServices.fbUser().first_name + ' ' + this.userServices.fbUser().last_name,
      date: new Date().getTime(),
      courseId: this.courseId,
      message: this.htmlContent};

    this.subscriptions.push(this.coursesServices.sendMessage(this.currentConversation, this.id, conversation).subscribe( (resp) => {
      console.log(resp);
      if (resp) {
        this.totalExchanges++;
      }
    }));
  }

  loadDiscussion() {
    this.loading = true;
    this.replying = false;
    this.htmlContent = '';

    this.subscriptions.push(this.coursesServices.getConversationInfo(this.courseId, this.id)
      .subscribe( (resp: {id: any, title: any, description: any, isClosed: any, date: string}) => {
        this.description = resp.description;
        this.title = resp.title;
        this.date = new Date(resp.date);
      }));

    this.subscriptions.push(this.coursesServices.getAllDiscussionPosts(this.courseId, this.id)
        .subscribe( (resp: Post[]) => {
            this.messages = resp;
            this.loading = false;
        }));

    //tslint:disable-next-line:max-line-length
    // this.subscriptions.push(this.coursesServices.getConversations()
    //   .subscribe( (resp: {conversations: DIscussions[], total: number}) => {
    //       this.messages = resp.conversations;
    //       this.totalExchanges = resp.total;
    //       this.loading = false;
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
