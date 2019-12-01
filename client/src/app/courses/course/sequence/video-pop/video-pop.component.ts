import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Optional, Inject } from '@angular/core';

@Component({
  selector: 'app-video-pop',
  templateUrl: './video-pop.component.html',
  styleUrls: ['./video-pop.component.scss']
})
export class VideoPopComponent implements OnInit {


  public link = '';

  constructor(
    private dialogRef: MatDialogRef<VideoPopComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data,
    private sanitizer: DomSanitizer,
  ) {
    this.link = data;
  }

  ngOnInit() {
  }

  sanitizeURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

}
