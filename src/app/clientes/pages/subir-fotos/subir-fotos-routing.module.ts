import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubirFotosPage } from './subir-fotos.page';

const routes: Routes = [
  {
    path: '',
    component: SubirFotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubirFotosPageRoutingModule {}
