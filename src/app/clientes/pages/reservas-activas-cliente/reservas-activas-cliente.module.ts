import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservasActivasClientePageRoutingModule } from './reservas-activas-cliente-routing.module';

import { ReservasActivasClientePage } from './reservas-activas-cliente.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReservasActivasClientePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ReservasActivasClientePage]
})
export class ReservasActivasClientePageModule {}
