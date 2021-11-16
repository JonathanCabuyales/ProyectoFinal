import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarComentPage } from './modificar-coment.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarComentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarComentPageRoutingModule {}
