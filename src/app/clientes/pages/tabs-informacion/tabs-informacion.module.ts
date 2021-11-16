import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsInformacionPageRoutingModule } from './tabs-informacion-routing.module';

import { TabsInformacionPage } from './tabs-informacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsInformacionPageRoutingModule
  ],
  declarations: [TabsInformacionPage]
})
export class TabsInformacionPageModule {}
