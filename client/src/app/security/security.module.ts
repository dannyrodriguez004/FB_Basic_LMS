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



@NgModule({
  declarations: [SecurityComponent, LoginComponent, RegisterComponent, AdminRegisterComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class SecurityModule { }
