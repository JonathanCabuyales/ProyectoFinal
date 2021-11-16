import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDirectoPageRoutingModule } from './chat-directo-routing.module';

import { ChatDirectoPage } from './chat-directo.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDirectoPageRoutingModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [ChatDirectoPage]
})
export class ChatDirectoPageModule {}
