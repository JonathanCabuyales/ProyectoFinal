import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarImagenesPage } from './agregar-imagenes.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarImagenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarImagenesPageRoutingModule {}
