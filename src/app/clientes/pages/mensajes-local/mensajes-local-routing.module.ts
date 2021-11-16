import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajesLocalPage } from './mensajes-local.page';

const routes: Routes = [
  {
    path: '',
    component: MensajesLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajesLocalPageRoutingModule {}
