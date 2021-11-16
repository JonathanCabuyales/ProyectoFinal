import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentariosPropPageRoutingModule } from './comentarios-prop-routing.module';

import { ComentariosPropPage } from './comentarios-prop.page';
import { RatingModule } from 'ng-starrating';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingModule,
    ReactiveFormsModule,
    PipesModule,
    ComentariosPropPageRoutingModule
  ],
  declarations: [ComentariosPropPage]
})
export class ComentariosPropPageModule {}
