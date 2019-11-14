import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InboxComponent} from './inbox/inbox.component';
import {ConversationComponent} from './inbox/conversation/conversation.component';
import {NewMessageComponent} from './inbox/new-message/new-message.component';


const routes: Routes = [
  {path: '', component: InboxComponent},
  {path: 'conversations', component: ConversationComponent},
  {path: 'new-message', component: NewMessageComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
