import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelppageRoutingModule } from './helppage-routing.module';
import { HelppageComponent } from './helppage/helppage.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [HelppageComponent],
  imports: [
    CommonModule,
    HelppageRoutingModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatTableModule
  ]
})
export class HelppageModule { }
