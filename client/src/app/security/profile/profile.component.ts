import { Component, OnInit, NgZone } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UtilityService} from '../../services/utility.service';
import {UsertypeModel} from '../../models/usertype.model';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ProfileEditorComponent} from './profile-editor/profile-editor.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading = true;
  subscriptions: Subscription[] = [];
  loadingPic = true;

  constructor(
    private route: ActivatedRoute,
    private userServices: UserService,
    private dialog: MatDialog,
    private coursesServices: CoursesService,
    private router: Router,
    private utilityServices: UtilityService,
    private zone: NgZone,
  ) {
    this.userServices.resetUserModel();
    this.subscriptions.push(this.userServices.profilePicReady.subscribe(bool => {
      this.zone.run(() => {
        console.log('############### Profile Pic Ready ' + this.userServices.profilePicURL);
        this.loadingPic = false;
      });
    }));
  }

  getUser() {
    return this.userServices.fbUser();
  }

  getProfilePic() {
    return this.userServices.profilePicURL;
  }

  ngOnInit() {
    this.loading = true;
    this.loadingPic = false;
    this.userServices.fbUser();

    this.userServices.getFacebookProfilePic();

    // if (!this.userServices.fbUser() && !this.userServices.getIsAdmin()) {
    //     console.log('not authorized!');
    //     this.router.navigateByUrl('/');
    //   }
    this.loading = false;
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }

  openEditRegisterProfile() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ProfileEditorComponent, {
      width: '90%',
      data: {
        id: this.userServices.fbUser().id,
        first_name: this.userServices.fbUser().first_name,
        last_name: this.userServices.fbUser().last_name,
        email: this.userServices.fbUser().email,
        phone: this.userServices.fbUser().phone,
        country: this.userServices.fbUser().country,
        type: UsertypeModel.Student
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        this.ngOnInit();
        console.log(result);
      }
    }));


  }

}
