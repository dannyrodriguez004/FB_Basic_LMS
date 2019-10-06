import { CoursesService } from './../../../courses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Resource } from 'src/app/courses/courses.models';
import { NewContentComponent } from '../new-content/new-content.component';

@Component({
  selector: 'app-module-editor',
  templateUrl: './module-editor.component.html',
  styleUrls: ['./module-editor.component.scss']
})
export class ModuleEditorComponent implements OnInit {

  current_course: string;
  current_module: {id: string, name: string, resources: Resource[]};

  submitting = false;

  moduleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModuleEditorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {module:{id: string, name: string, resources: Resource[]}, course_id: string},
    private formBuilder: FormBuilder,
    private courseServices: CoursesService,
    private dialog: MatDialog,
  ) { 
    this.current_course = data.course_id;
    this.current_module = data.module;
    this.moduleForm = this.formBuilder.group({
      title: [data.module.name, Validators.required],
    });
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  reloadModule() {
  
    this.courseServices.getCourseModule(this.current_course, this.current_module.id).subscribe( (resp: {id: string, name: string, resources: Resource[]}) => {
      this.current_module = resp;
    });
  }

  createModule() {
    const newModule = {
      name: this.moduleForm.value.title
    };
    this.submitting = true;
    this.courseServices.newModule(this.current_course, newModule).subscribe( (resp) => {
      if(resp) {
        this.dialogRef.close(resp);
      }
      this.submitting = false;
    });
  }

  removeContent(content: Resource) {
    console.log('remove:', content);
    this.courseServices.removeContent(this.current_course, this.current_module.id, content.id).subscribe( (resp) => {
      if(resp) {
        this.current_module.resources.splice(this.current_module.resources.indexOf(content));
      }
      console.log(resp);
    });
  }

  openNewContentDialog() {

    const dialogReference = this.dialog.open(NewContentComponent, {
      width: '90%',
      data: {
        course: this.current_course,
        current_module: this.current_module.id,
      }
    });

    dialogReference.afterClosed().subscribe( (result) => {
      if(result) {
        console.log(result);
        this.reloadModule();
      }
    })
  }

}
