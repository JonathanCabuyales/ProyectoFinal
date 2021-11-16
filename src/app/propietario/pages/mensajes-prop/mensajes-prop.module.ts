import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajesPropPageRoutingModule } from './mensajes-prop-routing.module';

import { MensajesPropPage } from './mensajes-prop.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MensajesPropPageRoutingModule
  ],
  declarations: [MensajesPropPage]
})
export class MensajesPropPageModule {}
