import { CoursesService } from './../../../../courses.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input, Output } from '@angular/core';
import { NewContentComponent } from '../new-content.component';
import { EventEmitter } from '@angular/core';


function urlValidator(control: FormControl) {
  let link: string = control.value;
  if(link.indexOf("http://") != 0 && link.indexOf("https://") != 0) {
    
    return link;
  }
  return null;
}


@Component({
  selector: 'app-new-embedded-video',
  templateUrl: './new-embedded-video.component.html',
  styleUrls: ['./new-embedded-video.component.scss']
})
export class NewEmbeddedVideoComponent implements OnInit {

  submitting = false;

  @Input('current_dialog') current_dialog: MatDialogRef<NewContentComponent>;
  @Input('data') data: {course: string, current_module: string};
  @Output() isSubmitting = new EventEmitter<boolean>();

  newEmbedForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private coursesServices: CoursesService
    ) {
      this.newEmbedForm = this.formBuilder.group({
        title: ['', Validators.required],
        code: ['https://', [Validators.required, urlValidator]]
      });
     }

  ngOnInit() {
  }

  pushEmbed() {
    const content = {
      title: this.newEmbedForm.value.title,
      embedded: this.newEmbedForm.value.code
    };

    this.submitting = true;
    this.isSubmitting.emit(true);
    this.coursesServices.newContentPush(this.data.course, this.data.current_module, content).subscribe( (resp) => {
      if(resp) {
        this.current_dialog.close(resp);
      }
      this.submitting = false;
      this.isSubmitting.emit(false);
    });
  }

  onNoClick() {
    this.current_dialog.close();
  }

}