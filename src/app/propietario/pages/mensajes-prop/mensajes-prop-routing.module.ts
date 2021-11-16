import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajesPropPage } from './mensajes-prop.page';

const routes: Routes = [
  {
    path: '',
    component: MensajesPropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajesPropPageRoutingModule {}
