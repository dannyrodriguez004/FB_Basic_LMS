import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InboxComponent} from './inbox/inbox.component';
import {ConversationComponent} from './inbox/conversation/conversation.component';
import {NewMessageComponent} from './inbox/new-message/new-message.component';
import {DiscussionsComponent} from "../courses/course/discussions/discussions.component";
import {AuthGuard} from "../security/security/auth.guard";
import {NewConversationComponent} from './inbox/conversation/new-conversation/new-conversation.component';


const routes: Routes = [
  {path: '', component: InboxComponent},
  {path: 'conversations', component: ConversationComponent},
  {path: 'new-message', component: NewMessageComponent},
  {path: 'new-conversation', component: NewConversationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule { }
