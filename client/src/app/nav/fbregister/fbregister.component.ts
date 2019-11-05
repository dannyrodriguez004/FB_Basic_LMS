import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../user.service';
import {UserModel} from '../../models/usermodel.models';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fbregister',
  templateUrl: './fbregister.component.html',
  styleUrls: ['./fbregister.component.scss']
})
export class FBRegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: UserModel;
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<FBRegisterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {id: string, first_name: string, last_name: string, email: string},


  ) {
    console.log(data.id);
    this.registerForm = this.formBuilder.group({
      id: data.id,
      first_name: [data.first_name, Validators.required],
      last_name: [data.last_name, Validators.required],
      email: [data.email, [Validators.email, Validators.required]],
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
    // this.userServices.existingStudent(this.userServices.getCurrentUser()).subscribe( (resp: boolean) => {
    //
    //   if (resp) {
    this.userServices.addUser( {
          userID: this.registerForm.value.id,
          email: this.registerForm.value.email,
          first_name: this.registerForm.value.first_name,
          last_name: this.registerForm.value.last_name,
          phone: this.registerForm.value.phone,
          country: this.registerForm.value.country
        });
      //     .subscribe((response) => {
    //     if (response) {
    //       this.router.navigateByUrl('/nav/dashboard');
    //     }
    this.loading = false;
    this.dialogRef.close();
    //   });
    //   }
    // });
  }

  ngOnInit() {
    // this.user = this.userServices.getCurrentUser();
  }

}
