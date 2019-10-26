import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
export class AdminRegisterComponent implements OnInit {


  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.registerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      primary: ['', [Validators.email, Validators.required]],
      contact: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required],
      check: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

}
