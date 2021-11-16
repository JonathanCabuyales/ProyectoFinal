import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarComentPageRoutingModule } from './modificar-coment-routing.module';

import { ModificarComentPage } from './modificar-coment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarComentPageRoutingModule
  ],
  declarations: [ModificarComentPage]
})
export class ModificarComentPageModule {}
