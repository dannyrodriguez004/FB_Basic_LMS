import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.userServices.addStudent({
      key: '0', /////////////////////// debug value change it! to facebook id value
      token: 'token', /////////////////////////////// same story here
      email: this.registerForm.value.email,
      fname: this.registerForm.value.fname,
      lname: this.registerForm.value.lname,
    }).subscribe( (resp) => {
      if(resp) this.router.navigateByUrl('/');
      this.loading = false;
    })
  }

}
