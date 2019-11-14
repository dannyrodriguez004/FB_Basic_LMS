import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatCardModule, MatButtonModule, MatExpansionModule} from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { ViewLogsComponent } from './view-logs/view-logs.component';

@NgModule({
  declarations: [DashboardComponent, ViewLogsComponent
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule
  ]
})
export class DashboardModule { }
