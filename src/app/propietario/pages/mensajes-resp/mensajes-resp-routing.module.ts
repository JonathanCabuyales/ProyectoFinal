import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajesRespPage } from './mensajes-resp.page';

const routes: Routes = [
  {
    path: '',
    component: MensajesRespPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajesRespPageRoutingModule {}
