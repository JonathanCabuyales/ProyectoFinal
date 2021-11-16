import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajesRespPageRoutingModule } from './mensajes-resp-routing.module';

import { MensajesRespPage } from './mensajes-resp.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    MensajesRespPageRoutingModule
  ],
  declarations: [MensajesRespPage]
})
export class MensajesRespPageModule {}
