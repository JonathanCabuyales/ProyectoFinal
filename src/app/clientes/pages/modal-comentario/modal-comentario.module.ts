import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalComentarioPageRoutingModule } from './modal-comentario-routing.module';

import { ModalComentarioPage } from './modal-comentario.page';
import { RatingModule } from "ng-starrating";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalComentarioPageRoutingModule,
    RatingModule

  ],
  declarations: [ModalComentarioPage]
})
export class ModalComentarioPageModule {}
