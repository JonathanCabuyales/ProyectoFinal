import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsClientePageRoutingModule } from './tabs-cliente-routing.module';

import { TabsClientePage } from './tabs-cliente.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    TabsClientePageRoutingModule
  ],
  declarations: [TabsClientePage]
})
export class TabsClientePageModule {}
