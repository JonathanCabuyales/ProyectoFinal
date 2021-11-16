import { Pipe, PipeTransform } from '@angular/core';
import { fotos } from '../interfaces/interfaces.futbol';

@Pipe({
  name: 'fotos'
})
export class FotosPipe implements PipeTransform {

  transform(value: fotos[]): string {
    if(value){
      if(value.length > 0){
        return value[value.length - 1].url;
      }else{
        return 'assets/img/no-img.png';
      }
    }else{
      
      return 'assets/img/no-img.png';
    }
  }

}
