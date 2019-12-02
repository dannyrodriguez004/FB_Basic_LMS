import { PracticeComponent } from './../practice/practice.component';
import { VideoPopComponent } from './video-pop/video-pop.component';
import { MatDialog } from '@angular/material';
import { QuizDialogComponent } from './../modules/quiz-dialog/quiz-dialog.component';
import { CoursesService } from './../../../services/courses.service';
import { UserService } from './../../../services/user.service';
import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';


export interface Module {
  id:string;
  name:string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  mod: string;
  title: string;
  url: string;
  link: string;
  outOf: number;
  embedded: string;
  page: string;
}

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  public loading = false;

  @Input("course") course: string = '-LoXRZvbw_tJaWGIxgGF';

  constructor(
    private userServices:UserService,
    private courseServices:CoursesService,
    private dialog:MatDialog
    ) { }

  modules = [];

  ngOnInit() {
    this.loading = true;
    this.courseServices.getModules(this.course).subscribe( (resp: Module[]) => {

      resp.forEach( mod => {
        var groups = [];
        var group = [];

        var i,j,temparray,chunk = 3;
        for (i=0,j=mod.resources.length; i<j; i+=chunk) {
            temparray = mod.resources.slice(i,i+chunk);
            groups.push(temparray);
        }
        this.modules.push({
          id: mod.id,
          name: mod.name,
          groups: groups
        })
      });

      this.loading = false;
    })
  }

  openInNewTab(url) {
    window.open(url, '_blank');
  }

  openVideo(url) {

    const dialogRef = this.dialog.open(VideoPopComponent, {
      panelClass: 'app-full-bleed-dialog',
      width: '90%',
      height: '90%',
      data: url
    });

  }

  openQuizDialog(courseModule, quiz) {

    const dialogRef = this.dialog.open(QuizDialogComponent, {
      // width: '90%',
      data: {
        module: courseModule,
        course: this.course,
        quiz
      },
    });

    dialogRef.afterClosed().subscribe( (result) => {

    });
  }

  test(mod, contId) {
    const dialogRef = this.dialog.open(PracticeComponent, {
      //panelClass: 'app-full-bleed-dialog',
      width: '90%',
      data: {
        course: this.course,
        module: mod,
        contId: contId
      }
    });
  }

}
