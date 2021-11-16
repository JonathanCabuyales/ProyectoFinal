import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarTelfPageRoutingModule } from './modificar-telf-routing.module';

import { ModificarTelfPage } from './modificar-telf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarTelfPageRoutingModule
  ],
  declarations: [ModificarTelfPage]
})
export class ModificarTelfPageModule {}
