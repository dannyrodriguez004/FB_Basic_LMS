import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule, MatButtonModule} from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { ViewLogsComponent } from './view-logs/view-logs.component';
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [DashboardComponent, ViewLogsComponent
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule
  ]
})
export class DashboardModule { }
