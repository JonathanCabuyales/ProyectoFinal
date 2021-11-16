import { Pipe, PipeTransform } from '@angular/core';
import { fotos } from '../interfaces/interfaces.futbol';

@Pipe({
  name: 'fotosProp'
})
export class FotosPropPipe implements PipeTransform {

  transform(value: fotos[]): string {
    
    if(value){
      if(value.length > 0){
        let dividir = value.slice(value.length-2);
        
        for(let r of dividir){
  
          return r.url;
        }
        /* return dividir[dividir.length].url; */
      }else{
        return 'assets/img/no-img.png';
      }
    }else{
      return 'assets/img/no-img.png';
    }
  }

}
