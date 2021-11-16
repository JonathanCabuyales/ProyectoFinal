import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentariosClientePageRoutingModule } from './comentarios-cliente-routing.module';

import { ComentariosClientePage } from './comentarios-cliente.page';

import { RatingModule } from "ng-starrating";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingModule,
    ComentariosClientePageRoutingModule
  ],
  declarations: [ComentariosClientePage]
})
export class ComentariosClientePageModule {}
