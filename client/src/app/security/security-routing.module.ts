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
import {SignupComponent} from './signup/signup.component';

const routes: Routes = [
  {path: '', component: SecurityComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},

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
