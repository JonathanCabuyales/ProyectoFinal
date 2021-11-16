import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionPPage } from './notificacion-p.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionPPageRoutingModule {}
