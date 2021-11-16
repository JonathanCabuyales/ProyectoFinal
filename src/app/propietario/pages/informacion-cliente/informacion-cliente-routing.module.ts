import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionClientePage } from './informacion-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionClientePageRoutingModule {}
