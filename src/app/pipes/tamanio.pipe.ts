import { Pipe, PipeTransform } from '@angular/core';
export interface reservar{
  data: any;
  nombreUser: string;
}
@Pipe({
  name: 'tamanio'
})
export class TamanioPipe implements PipeTransform {

  transform(value: reservar[]): any {
    
    if(value){
      
      return value[0];
    }else{
      return value[0]
    }
  }

}
