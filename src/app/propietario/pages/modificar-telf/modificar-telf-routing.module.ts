import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarTelfPage } from './modificar-telf.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarTelfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarTelfPageRoutingModule {}
