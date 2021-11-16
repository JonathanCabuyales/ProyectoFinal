import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historiaReserva'
})
export class HistoriaReservaPipe implements PipeTransform {

  transform(value: any[]): any[] {
    if(value.length > 0){
      return value[0];
    }else{
      return [];
    }
    
  }

}
