import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarComentarioPage } from './modificar-comentario.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarComentarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarComentarioPageRoutingModule {}
