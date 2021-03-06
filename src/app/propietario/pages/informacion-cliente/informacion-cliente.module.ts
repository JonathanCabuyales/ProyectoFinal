import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionClientePageRoutingModule } from './informacion-cliente-routing.module';

import { InformacionClientePage } from './informacion-cliente.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    InformacionClientePageRoutingModule
  ],
  declarations: [InformacionClientePage]
})
export class InformacionClientePageModule {}
