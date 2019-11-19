import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security/security.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {AdminRegisterComponent} from './admin-register/admin-register.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ProfilePictureComponent } from './profile/profile-picture/profile-picture.component';
import { DetailsComponent } from './profile/details/details.component';

@NgModule({
  declarations: [SecurityComponent, LoginComponent, RegisterComponent, AdminRegisterComponent, ProfileComponent, ProfilePictureComponent, DetailsComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ]
})
export class SecurityModule { }
