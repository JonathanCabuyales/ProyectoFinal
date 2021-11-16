import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'devolverArreglo'
})
export class DevolverArregloPipe implements PipeTransform {

  transform(value: any): any {
    
    for(let i in value){
      if(i !== 'nombreUser'){
        
        return value[i];
      }
      
    }
    
    return null;
  }

}
