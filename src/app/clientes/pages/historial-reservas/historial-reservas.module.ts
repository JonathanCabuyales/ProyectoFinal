import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialReservasPageRoutingModule } from './historial-reservas-routing.module';

import { HistorialReservasPage } from './historial-reservas.page';
import { PipesModule } from '../../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialReservasPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [HistorialReservasPage]
})
export class HistorialReservasPageModule {}
