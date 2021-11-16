import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarRedesPage } from './agregar-redes.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarRedesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarRedesPageRoutingModule {}
