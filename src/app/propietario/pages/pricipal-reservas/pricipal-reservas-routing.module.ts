import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PricipalReservasPage } from './pricipal-reservas.page';

const routes: Routes = [
  {
    path: '',
    component: PricipalReservasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricipalReservasPageRoutingModule {}
