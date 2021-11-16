import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirFotosPageRoutingModule } from './subir-fotos-routing.module';

import { SubirFotosPage } from './subir-fotos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirFotosPageRoutingModule
  ],
  declarations: [SubirFotosPage]
})
export class SubirFotosPageModule {}
