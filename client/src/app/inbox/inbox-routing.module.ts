import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InboxComponent} from './inbox/inbox.component';
import {ConversationComponent} from './inbox/conversation/conversation.component';


const routes: Routes = [
  {path: '', component: InboxComponent},
  {path: 'conversations', component: ConversationComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
