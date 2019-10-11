import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule, MatButtonModule} from '@angular/material';
import { MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [DashboardComponent
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class DashboardModule { }
