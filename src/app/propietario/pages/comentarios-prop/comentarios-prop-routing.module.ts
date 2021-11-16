import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComentariosPropPage } from './comentarios-prop.page';

const routes: Routes = [
  {
    path: '',
    component: ComentariosPropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComentariosPropPageRoutingModule {}
