import { Component, OnInit, OnChanges } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import {UserModel} from '../../models/usermodel.models';
import {UsertypeModel} from "../../models/usertype.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // navs = [
  //   {val: 'Home', ico: 'home'},
  //   {val: 'Course History', ico: 'view_module'},
  //   {val: 'Contact Inforamtion', ico: 'assessment'},
  //   {val: 'About Me', ico: 'forum'},
  //   {val: 'Privacy', ico: 'forum'}];

  private navItem = 'Home';

  private subscriptions: Subscription[] = [];
  // private authorized = false;
  // private userModel: UserModel;
  private userID: string;
  loading = true;


  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    if (!this.userServices.fbUser() && !this.userServices.getIsAdmin()) {
        console.log('not authorized!');
        this.router.navigateByUrl('/');
      }
    this.loading = false;
    // this.subscriptions.push(this.router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    //     this.loadData();
    //   }
    // }));
  }

  loadData() {
    // this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
    //   if (params.select) {
    //     this.navItem = params.select;
    //   }
    //   if (params.userModel) {
    //     this.userModel = params.userModel;
    //   }
    // }));
    // this.userID = this.userServices.fbUser().id;
  }

  setNav(val: string) {
    this.navItem = val;
  }

  isEqual(val: string) {
    return this.navItem === val;
  }
  //
  // ngOnChanges() {
  //   this.ngOnInit();
  // }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}
