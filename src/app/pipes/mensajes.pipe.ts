import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../interfaces/chat.interface';

@Pipe({
  name: 'mensajes'
})
export class MensajesPipe implements PipeTransform {

  transform(value: any[]) {
    if(value.length > 0){
      for(let chat of value){
        return chat;

      }
    }else{
      return value}
  }

}
