import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricipalReservasPageRoutingModule } from './pricipal-reservas-routing.module';

import { PricipalReservasPage } from './pricipal-reservas.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PricipalReservasPageRoutingModule
  ],
  declarations: [PricipalReservasPage]
})
export class PricipalReservasPageModule {}
