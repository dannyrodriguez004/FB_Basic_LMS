import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-enroll',
  templateUrl: './confirm-enroll.component.html',
  styleUrls: ['./confirm-enroll.component.scss']
})
export class ConfirmEnrollComponent implements OnInit {

  students: {id: string, fname: string, lname: string, email: string, phone: string}[];

  constructor() { }

  ngOnInit() {
  }



}
