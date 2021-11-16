import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlidesPropPage } from './slides-prop.page';

const routes: Routes = [
  {
    path: '',
    component: SlidesPropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlidesPropPageRoutingModule {}
