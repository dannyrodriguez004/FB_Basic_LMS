import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoursesService} from '../../../services/courses.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {UserService} from '../../../services/user.service';
import {Conversation, Course, CourseNav, Message, Post} from '../../../models/courses.models';
import {NewDiscussionComponent} from '../../../courses/course/discussions/new-discussion/new-discussion.component';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  subscriptions: Subscription[] = [];
  today = new Date();
  conversationForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;
  @Input ('courseName') courseName: string;
  @Input('courseId') courseId: string;     // course id
  @Input('title') title: string;           // discussion title
  description: string;                     // discussion description HTML format
  conversation: Conversation;            // discussion posts
  date: Date = this.today;
  replying = false;
  htmlContent = '';
  recipients: {id: '', fname: '', lname: '', email: ''}[];
  recipient: {id: '', fname: '', lname: '', email: ''};

  loading = true;
  private myCourses: CourseNav[];
  isPublic = false;

  constructor(
    public dialogRef: MatDialogRef<NewMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: string,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private coursesServices: CoursesService,
    private userServices: UserService,
    private router: Router,
  ) {
    this.conversationForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: ['', Validators.required],
      date: ['', Validators.required],
      isPublic: ['', Validators.required],
      courseId: ['', Validators.required],
      recipients: ['', Validators.required]
    });

    this.current_course = data;

  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    outline: true,
    sanitize: false,
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  getDescriptionError() {
    return this.conversationForm.hasError('required', 'discussionForm.description')  ? '' :
      this.conversationForm.controls.description.dirty ? 'The description of a discussion cannot be empty!' : '';
  }

  ngOnInit() {
    this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: CourseNav[]) => {
      this.myCourses = resp;
      console.log(this.myCourses);
    }));

  }

  getStudents() {
    this.subscriptions.push(this.coursesServices.getStudents(this.current_course)
      .subscribe( (response: {id: '', fname: '', lname: '', email: ''}[]) => {
        this.recipients = response;
        console.log('STUDENTS', response);
      }));
  }

  sendMessage() {
    const conversation = {
      title: this.conversationForm.value.title,
      description: this.conversationForm.value.description,
      user_id: this.userServices.fbUser().id,
      user_name: this.userServices.fbUser().first_name + ' ' + this.userServices.fbUser().last_name,
      date: new Date().getTime(),
      recipients: this.recipients,
      courseId: this.courseId,
      current_course: this.current_course,
      message: this.htmlContent,
      isPublic: false
    };

    this.coursesServices.newConversation(this.courseId, conversation).subscribe( (resp) => {
      this.dialogRef.close(resp);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
