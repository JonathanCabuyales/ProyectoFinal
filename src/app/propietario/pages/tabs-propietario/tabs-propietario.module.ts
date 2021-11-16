import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPropietarioPageRoutingModule } from './tabs-propietario-routing.module';

import { TabsPropietarioPage } from './tabs-propietario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPropietarioPageRoutingModule
  ],
  declarations: [TabsPropietarioPage]
})
export class TabsPropietarioPageModule {}
