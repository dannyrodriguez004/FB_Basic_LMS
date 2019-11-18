import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ViewLogsComponent } from './view-logs/view-logs.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'logs', component: ViewLogsComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
