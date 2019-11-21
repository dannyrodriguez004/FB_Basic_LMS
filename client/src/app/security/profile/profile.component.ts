import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UtilityService} from '../../services/utility.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private coursesServices: CoursesService,
    private router: Router,
    private utilityServices: UtilityService,
  ) {
    this.userServices.resetUserModel();
  }

  ngOnInit() {
    this.loading = true;
    // if (!this.userServices.fbUser() && !this.userServices.getIsAdmin()) {
    //     console.log('not authorized!');
    //     this.router.navigateByUrl('/');
    //   }
    this.loading = false;
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  saveProfilePicture() {
  }
}
