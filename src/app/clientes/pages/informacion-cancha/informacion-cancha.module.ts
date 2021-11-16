import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionCanchaPageRoutingModule } from './informacion-cancha-routing.module';

import { InformacionCanchaPage } from './informacion-cancha.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionCanchaPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [InformacionCanchaPage]
})
export class InformacionCanchaPageModule {}
