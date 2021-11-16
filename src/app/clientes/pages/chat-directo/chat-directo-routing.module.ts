import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDirectoPage } from './chat-directo.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDirectoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDirectoPageRoutingModule {}
