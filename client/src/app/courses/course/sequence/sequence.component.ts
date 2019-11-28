import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  constructor() { }

  modules = [
    [
      [{icon: 'alarm'},{icon: 'alarm'},{icon: 'alarm'}],
      [{icon: 'alarm'},{icon: 'alarm'}],
      [{icon: 'alarm'}]
    ],
    []
  ];

  ngOnInit() {
  }

}
