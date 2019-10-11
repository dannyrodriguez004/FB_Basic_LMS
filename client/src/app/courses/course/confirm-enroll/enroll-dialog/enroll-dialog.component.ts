import { YesNoDialogComponent } from 'src/app/yes-no-dialog/yes-no-dialog.component';
import { CoursesService } from 'src/app/courses/courses.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';import { ModuleEditorComponent } from '../../modules/module-editor/module-editor.component';

@Component({
  selector: 'app-enroll-dialog',
  templateUrl: './enroll-dialog.component.html',
  styleUrls: ['./enroll-dialog.component.scss']
})
export class EnrollDialogComponent implements OnInit {

  current_course: string = '';
  student: {id: string, fname: string, lname: string, email: string, phone: string};
  constructor(
    public dialogRef: MatDialogRef<EnrollDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {student: {id: string, fname: string, lname: string, email: string, phone: string}, course: string},
    private coursesServices: CoursesService,
    private dialog: MatDialog,
  ) { 
    this.student = data.student;
    this.current_course = data.course;
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  confirm() {
    const yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: "Warning!",
        message: "Confirm enrollment?",
      }
    });

    yesNoDialogRef.afterClosed().subscribe( (resp) => {
      if(resp) {
        //confirm enrollment
        console.log("confirm enrollment!");
      }
    })
  }

  remove() {
    const yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        title: "Warning!",
        message: "Remove student from this list? This is a permanent action, and cannot be undone.",
      }
    });

    yesNoDialogRef.afterClosed().subscribe( (resp) => {
      if(resp) {
        this.coursesServices.removeRegistree(this.student.id, this.current_course).subscribe( (removed) => {
          if(removed) {
            this.dialogRef.close(removed);
          }
          console.log('removed', removed);
        })
        console.log("removing student from list!");
      }
    })
  }

}
