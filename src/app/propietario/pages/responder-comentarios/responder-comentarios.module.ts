import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponderComentariosPageRoutingModule } from './responder-comentarios-routing.module';

import { ResponderComentariosPage } from './responder-comentarios.page';
import { PipesModule } from '../../../pipes/pipes.module';
import { RatingModule } from 'ng-starrating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipesModule,
    RatingModule,
    ResponderComentariosPageRoutingModule
  ],
  declarations: [ResponderComentariosPage]
})
export class ResponderComentariosPageModule {}
