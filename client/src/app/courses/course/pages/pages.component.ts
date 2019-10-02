import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  subscriptions: Subscription[] = [];

  @Input('current_course') current_course: string;
  current_page = '';
  module_id = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions.push(this.route.queryParams.subscribe( params => {
      if(params.page_id) {
        this.current_page = params.page_id;
      }
      if(params.module) {
        this.module_id = params.module;
      }
    }));
  }

}
