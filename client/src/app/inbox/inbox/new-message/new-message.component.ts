import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoursesService} from "../../../services/courses.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {
  today = new Date();
  conversationForm: FormGroup;
  // tslint:disable-next-line:variable-name
  current_course: string;
  constructor(
    public dialogRef: MatDialogRef<NewMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: string,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private coursesServices: CoursesService,
  ) {
    this.conversationForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: [false, Validators.required],
      date: ['', Validators.required],
    });

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
  }

  sendMessage() {
    const conversation = {
      title: this.conversationForm.value.title,
      description: this.conversationForm.value.description,
      user_id: this.conversationForm.value.isClosed,
      date: this.conversationForm.value.endDate,
      // public: this.discussionForm.value.public
    };

    this.coursesServices.newConversation(this.current_course, conversation).subscribe( (resp) => {
      this.dialogRef.close(resp);
    });
  }

  setPrivate() {
    // this.public = false;
  }
  onNoClick() {
    this.dialogRef.close();
  }

}
