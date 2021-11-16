import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  passwordIguales(passw: string, confPass: string){
    return((formulario: FormGroup) => {
      const p1 = formulario.controls[passw];
      const p2 = formulario.controls[confPass];
      if(p1.value === p2.value){
        p2.setErrors(null);
      }else{
        p2.setErrors({noIgual: true});
      }
    }

    );
  }
}
