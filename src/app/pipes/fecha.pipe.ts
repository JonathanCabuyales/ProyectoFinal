import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: number): string {
    let fecha = new Date(value);
    let hora = fecha.getHours().toString();
    let minutes = fecha.getMinutes();
    let horaCombinada = hora + ':' + (minutes < 10 ? '0'+minutes:minutes);
    
    return horaCombinada;
  }

}
