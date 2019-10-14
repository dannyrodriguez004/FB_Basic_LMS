import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private subscription: Subscription[];
  submitted = false;
  error = '';
  type = 'password';
  show = false;
  loading: any;
  username: string;
  password: string;
  invalidCredentials = false;

  constructor(
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private router: Router,
    private userServices: UserService
  ) { }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  // onSubmit() {
  //   this.submitted = true;
  //
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //
  //   this.authentication.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
  //     .subscribe(
  //       () => {
  //         this.router.navigate(['/']);
  //       },
  //       error => {
  //         this.error = error;
  //       });
  // }
  //
  // toggleShow() {
  //   this.show = !this.show;
  //   if (this.show) {
  //     this.type = 'text';
  //   } else {
  //     this.type = 'password';
  //   }
  // }
  authenticateUser() {
    const authUser = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.subscription.push(
      this.userServices.Adminlogin(authUser)
        .subscribe(
          (payload) => {
            this.router.navigateByUrl('');
          },
          (err) => {
            if (err.status === 401) {
              this.invalidCredentials = true;
            }
          })
    );
  }
  // authenticateUser() {
  //   const authUser = {
  //     username: this.loginForm.value.email,
  //     password: this.loginForm.value.password
  //   };
    // this.subscription.push(
    //   this.authentication.authenticateUser(authUser)
    //     .subscribe(
    //       (payload) => {
    //         this.router.navigateByUrl('');
    //       },
    //       (err) => {
    //         if (err.status === 401) {
    //           this.invalidCredentials = true;
    //         }
    //       })
    // );
   }


   // ngOnDestroy() {
   //   if (this.subscription) {
   //     this.subscription.forEach((item) => {
   //       item.unsubscribe();
   //     });
   //   }
   // }
