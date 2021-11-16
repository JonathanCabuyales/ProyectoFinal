import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ultimoMensaje'
})
export class UltimoMensajePipe implements PipeTransform {

  transform(value: any[]): any[] {

    if(value.length > 0){
      let nuevo: any[] = [];
      nuevo.push(value[value.length - 1]);
      
      return nuevo;
    }else{
      return value;
    }
  }

}
