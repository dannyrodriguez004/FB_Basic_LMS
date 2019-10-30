import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AdminService} from '../../services/admin.service';
import {User} from '../../models/users.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router,
    private adminServices: AdminService
  ) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  register() {
    this.loading = true;
    this.adminServices.isUsernameAvailable(this.registerForm.value.primary).subscribe( (resp: boolean) => {
      if (resp) {
        this.adminServices.addInstructor({
          email: this.registerForm.value.email,
          first_name: this.registerForm.value.first_name,
          last_name: this.registerForm.value.last_name,
          address: this.registerForm.value.address,
          phone: this.registerForm.value.phone
        }).subscribe((result) => {
          if (result) {
            this.router.navigateByUrl('/');
          }
          this.loading = false;
        });
      }
    });
  }

  ngOnInit() {
    // this.user = this.userServices.getCurrentUser();
  }

}
