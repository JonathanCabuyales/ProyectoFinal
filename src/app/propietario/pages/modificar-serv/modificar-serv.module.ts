import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarServPageRoutingModule } from './modificar-serv-routing.module';

import { ModificarServPage } from './modificar-serv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModificarServPageRoutingModule
  ],
  declarations: [ModificarServPage]
})
export class ModificarServPageModule {}
