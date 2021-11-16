import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarImagenesPageRoutingModule } from './agregar-imagenes-routing.module';

import { AgregarImagenesPage } from './agregar-imagenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarImagenesPageRoutingModule
  ],
  declarations: [AgregarImagenesPage]
})
export class AgregarImagenesPageModule {}
