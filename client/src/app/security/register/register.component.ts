import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../models/usermodel.models';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: UserModel;
  loading = false;
  subscriptions: Subscription[] = [];
  private id = new FormControl('', [Validators.required]);

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    public dialogRef: MatDialogRef<RegisterComponent>,

  ) {
    this.registerForm = this.formBuilder.group({
      id: this.id,
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    outline: true,
    sanitize: false,
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };

  // addUser(userModel: any) {
  //   this.loading = true;
  //
  //   if (this.registerForm.pristine) {
  //     this.dialogRef.close();
  //   }  else {
  //     const user = {
  //       first_name:  this.registerForm.value.first_name,
  //       last_name: this.registerForm.value.last_name,
  //       address: this.registerForm.value.address,
  //       phone: this.registerForm.value.phone
  //     };
  //
  //     this.subscriptions.push(this.userServices.addUser({
  //       if (resp) {
  //         this.dialogRef.close(resp);
  //       }
  //     }));
  //   }
  //
  // }
  register() {
    this.loading = true;
    // this.userServices.existingStudent(this.userServices.redirectStudent()).subscribe( (resp: boolean) => {
    this.userServices.existingStudent(this.userServices.getCurrentUser()).subscribe( (resp: boolean) => {
      if (resp) {
        this.userServices.addUser( {
          email: this.registerForm.value.email,
          first_name: this.registerForm.value.first_name,
          last_name: this.registerForm.value.last_name,
          address: this.registerForm.value.address,
          phone: this.registerForm.value.phone,
          country: this.registerForm.value.country
        });
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    // this.user = this.userServices.getCurrentUser();
  }

}
