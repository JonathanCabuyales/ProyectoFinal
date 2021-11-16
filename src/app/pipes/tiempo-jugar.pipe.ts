import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoJugar'
})
export class TiempoJugarPipe implements PipeTransform {

  transform(value: number): string {
    if(value > 1){
      return value + ' horas';
    }else{

      return value + ' hora';
    }
  }

}
