import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionCanchaPage } from './informacion-cancha.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionCanchaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionCanchaPageRoutingModule {}
