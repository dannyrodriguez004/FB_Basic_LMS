import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  admins = [
    {name: 'Danny Rodriguez', phone: '(305)-439-1452', email: 'drodr518@fiu.edu'},
    {name: 'Joao Guiramaes', phone: '(754)-242-1096', email: 'jguim002@fiu.edu'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
