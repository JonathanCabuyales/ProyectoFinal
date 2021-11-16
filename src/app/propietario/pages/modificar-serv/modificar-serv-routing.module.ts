import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarServPage } from './modificar-serv.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarServPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarServPageRoutingModule {}
