import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { ConversationComponent } from './inbox/conversation/conversation.component';
import {MatIconModule} from '@angular/material/icon';
import {InboxRoutingModule} from './inbox-routing.module';
import {RouterModule} from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [InboxComponent, ConversationComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    InboxRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AngularEditorModule,
    FormsModule
  ],
  exports: [RouterModule]

})
export class InboxModule { }
