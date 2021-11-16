import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarComentarioPageRoutingModule } from './modificar-comentario-routing.module';

import { ModificarComentarioPage } from './modificar-comentario.page';

import { RatingModule } from "ng-starrating";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingModule,
    ModificarComentarioPageRoutingModule
  ],
  declarations: [ModificarComentarioPage]
})
export class ModificarComentarioPageModule {}
