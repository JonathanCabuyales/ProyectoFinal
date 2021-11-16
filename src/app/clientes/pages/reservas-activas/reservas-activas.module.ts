import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservasActivasPageRoutingModule } from './reservas-activas-routing.module';

import { ReservasActivasPage } from './reservas-activas.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservasActivasPageRoutingModule,
    PipesModule
  ],
  declarations: [ReservasActivasPage]
})
export class ReservasActivasPageModule {}
