import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarRedesPageRoutingModule } from './modificar-redes-routing.module';

import { ModificarRedesPage } from './modificar-redes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarRedesPageRoutingModule
  ],
  declarations: [ModificarRedesPage]
})
export class ModificarRedesPageModule {}
