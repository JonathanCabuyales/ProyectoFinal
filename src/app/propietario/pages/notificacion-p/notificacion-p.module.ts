import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionPPageRoutingModule } from './notificacion-p-routing.module';

import { NotificacionPPage } from './notificacion-p.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionPPageRoutingModule
  ],
  declarations: [NotificacionPPage]
})
export class NotificacionPPageModule {}
