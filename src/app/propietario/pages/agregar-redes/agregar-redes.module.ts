import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarRedesPageRoutingModule } from './agregar-redes-routing.module';

import { AgregarRedesPage } from './agregar-redes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AgregarRedesPageRoutingModule
  ],
  declarations: [AgregarRedesPage]
})
export class AgregarRedesPageModule {}
