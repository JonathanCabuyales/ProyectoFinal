import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionCanchaPageRoutingModule } from './informacion-cancha-routing.module';

import { InformacionCanchaPage } from './informacion-cancha.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    InformacionCanchaPageRoutingModule
  ],
  declarations: [InformacionCanchaPage]
})
export class InformacionCanchaPageModule {}
