import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  constructor() { }

  steps = [0,0,0,0,0,0,0,0,0,0,0,0];

  ngOnInit() {
  }

}
