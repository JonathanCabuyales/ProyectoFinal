import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlidesPropPageRoutingModule } from './slides-prop-routing.module';

import { SlidesPropPage } from './slides-prop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlidesPropPageRoutingModule
  ],
  declarations: [SlidesPropPage]
})
export class SlidesPropPageModule {}
