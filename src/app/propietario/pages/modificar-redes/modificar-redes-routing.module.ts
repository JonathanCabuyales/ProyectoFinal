import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarRedesPage } from './modificar-redes.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarRedesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarRedesPageRoutingModule {}
