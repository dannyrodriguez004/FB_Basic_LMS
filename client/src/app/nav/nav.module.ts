import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatTableModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatMenuModule
} from '@angular/material';
import { NavRoutingModule } from './nav-routing.module';
import { AngularEditorModule} from '@kolkov/angular-editor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { NewcourseComponent } from './newcourse/newcourse.component';

@NgModule({
  declarations: [NavbarComponent, MainComponent, NewcourseComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NavRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule
  ],
  entryComponents: [
    NewcourseComponent
  ]
})
export class NavModule { }
