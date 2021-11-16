import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerNotificacionPageRoutingModule } from './ver-notificacion-routing.module';

import { VerNotificacionPage } from './ver-notificacion.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    VerNotificacionPageRoutingModule
  ],
  declarations: [VerNotificacionPage]
})
export class VerNotificacionPageModule {}
