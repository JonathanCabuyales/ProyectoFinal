import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponderComentariosPage } from './responder-comentarios.page';

const routes: Routes = [
  {
    path: '',
    component: ResponderComentariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponderComentariosPageRoutingModule {}
