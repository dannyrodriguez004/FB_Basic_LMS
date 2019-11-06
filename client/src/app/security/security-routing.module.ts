import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SecurityComponent} from './security/security.component';
import {LoginComponent} from './login/login.component';
import {
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { RegisterComponent } from './register/register.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {path: '', component: SecurityComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-register', component: AdminRegisterComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule]
})

export class SecurityRoutingModule { }
