import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajesLocalPageRoutingModule } from './mensajes-local-routing.module';

import { MensajesLocalPage } from './mensajes-local.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MensajesLocalPageRoutingModule
  ],
  declarations: [MensajesLocalPage]
})
export class MensajesLocalPageModule {}
