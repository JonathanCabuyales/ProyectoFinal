import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservasActivasClientePage } from './reservas-activas-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ReservasActivasClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservasActivasClientePageRoutingModule {}
