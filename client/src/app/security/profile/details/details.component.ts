import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import { UserModel} from '../../../models/usermodel.models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  loading = true;
  userInfo: UserModel;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = true;
    this.userInfo = this.userService.fbUser();
    this.loading = false;
  }

}
