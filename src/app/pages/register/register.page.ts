import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Registro } from 'src/app/interfaces/interfaces.futbol';
import { FutbolInnService } from 'src/app/services/futbol-inn.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formularioRegistro: FormGroup;
  cedulaCantidad: boolean = false;
  cedulasIguales: boolean = false;
  cedulasVerificadas: boolean;
  contraseniasIguales: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _serviceFutbol: FutbolInnService,
    private _auth: AuthService,
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _route: Router,
    private _futlbolService: FutbolInnService
  ) { 
    this.crearFormulario();
  }

  ngOnInit() {
  }

  /* cantidadCedula(evento: any){
    let cantidad: string = evento.detail.value;
    if(cantidad.length < 10){
      this.cedulaCantidad = true;
    }else {
      this.cedulaCantidad = false;
    }
  } */

  cedulaIgual(){
    let cedula: string = this.formularioRegistro.controls.cedula.value;

    if(cedula.length === 10){
      this.cedulasVerificadas = this.validaCedula(cedula);
      
    }else if(cedula.length > 10){
      this.cedulasVerificadas = true;
      this.cedulasIguales = false;
    }else{
      this.cedulasVerificadas = false;
      this.cedulasIguales = false;
    }


    if(!this.cedulasVerificadas){

      this._futlbolService.getCedula(cedula).subscribe((resp) => {
        for(let id of resp.docs){
          if(id.data().cedula === cedula){
            this.cedulasIguales = true;
          }
        }
        
      });
    }
  }

  // funcion para validar cedulas
  validaCedula(cedula: any){
    let cedula_valida = false;
    let total = 0;
    let longitud = cedula.length;
    let longCheck = longitud - 1;
    if(cedula !== "" && longitud === 10){

      for (let index = 0; index < longCheck; index++) {
        if(index%2 === 0){
          let aux = cedula.charAt(index) * 2;
          if(aux > 9) aux = aux - 9;
          total = total + aux;
        }else{
          total = total + Number.parseInt(cedula.charAt(index))
        }
        
      }

      total = total % 10 ? 10 - total % 10 : 0;

      if(cedula.charAt(longitud - 1) == total){
        cedula_valida = false;
      }else{
        cedula_valida = true;
        
      }
      
    }else if(cedula.length > 10){
      cedula_valida = true;
    }else{
      cedula_valida = true;
    }

    return cedula_valida;
  }

  resetearForm(){
    this.formularioRegistro.reset({
      cedula: ''
    });
  }

 

  //funcion para guarda el registro
  async guardar(Formulario: FormGroup){
    if( this.formularioRegistro.invalid){
      return Object.values( this.formularioRegistro.controls ).forEach( validador => {
        validador.markAllAsTouched();
      });
    }
    
    

    const correo = this.formularioRegistro.value.correo;
    const passw = this.formularioRegistro.value.passw;
    const cargando = await this._loadingCtrl.create({
      message: 'Guardando datos, espere por favor',
    });
    const toast = await this._toastCtrl.create({
      message: 'el correo escrito ya existe.',
      position:'middle',
      duration: 1000,
    });
    this._auth.registrarUsuario( correo, passw )
    .then( resp => {
      const registro: Registro = {
        uid: resp.user.uid,
        nombre: this.formularioRegistro.value.nombre,
        apellido: this.formularioRegistro.value.apellido,
        cedula: this.formularioRegistro.value.cedula,
        correo: this.formularioRegistro.value.correo,
        contrasenia: this.formularioRegistro.value.passw,
        telf: this.formularioRegistro.value.telf,
        foto: [],
        tipo: 'user',
        token: {
          androidId: "",
          token: ""
        }
      }
      cargando.present();
      this.guardarDatos( registro );
      setTimeout(() => {
        cargando.dismiss();
        this.resetearForm();
        this._route.navigate(['/login']);
      }, 3000);
    })
    .catch( error => {
      toast.present();
    });
  }

  //funciones para validar el registro
  //nombre
  get NombreError(){
    return this.formularioRegistro.get('nombre').hasError('required') && (this.formularioRegistro.get('nombre').touched || this.formularioRegistro.get('nombre').dirty);
  }
  get cantidadNombre(){
    return this.formularioRegistro.get('nombre').hasError('minlength') && (this.formularioRegistro.get('nombre').touched || this.formularioRegistro.get('nombre').dirty);
  }

  //apellido
  get ApellidoError(){
    return this.formularioRegistro.get('apellido').hasError('required') && (this.formularioRegistro.get('apellido').touched || this.formularioRegistro.get('apellido').dirty);
  }
  get apellidoCantidad(){
    return this.formularioRegistro.get('apellido').hasError('minlength') && (this.formularioRegistro.get('apellido').touched || this.formularioRegistro.get('apellido').dirty);
  }

  //cedula
  get CedulaError(){
    return this.formularioRegistro.get('cedula').hasError('required') && (this.formularioRegistro.get('cedula').touched || this.formularioRegistro.get('cedula').dirty);
  }
  get cantidadCedula(){
    return this.formularioRegistro.get('cedula').hasError('minlength') && (this.formularioRegistro.get('cedula').touched || this.formularioRegistro.get('cedula').dirty);
  }

  get cantidadCedulaMax(){
    return this.formularioRegistro.get('cedula').hasError('maxlength') && (this.formularioRegistro.get('cedula').touched || this.formularioRegistro.get('cedula').dirty);
  }
  
  //correo
  get CorreoError(){
    return this.formularioRegistro.get('correo').hasError('required') && (this.formularioRegistro.get('correo').touched || this.formularioRegistro.get('correo').dirty);
  }
  get patterCorreo(){
    return this.formularioRegistro.get('correo').hasError('pattern') && (this.formularioRegistro.get('correo').touched || this.formularioRegistro.get('correo').dirty);
  }

  //contrasenia
  get PasswError(){
    return this.formularioRegistro.get('passw').hasError('required') && (this.formularioRegistro.get('passw').touched || this.formularioRegistro.get('passw').dirty);
  }
  get cantidadPassw(){
    return this.formularioRegistro.get('passw').hasError('minlength') && (this.formularioRegistro.get('passw').touched || this.formularioRegistro.get('passw').dirty);
  }

  //confirmar contrasenia
  get PasswConfError(){
    return this.formularioRegistro.get('confpassw').hasError('required') && (this.formularioRegistro.get('confpassw').touched || this.formularioRegistro.get('confpassw').dirty);
  }
  get cantidadConfPassw(){
    return this.formularioRegistro.get('confpassw').hasError('minlength') && (this.formularioRegistro.get('confpassw').touched || this.formularioRegistro.get('confpassw').dirty);
  }

  get validarPassw(){
    return this.formularioRegistro.get('confpassw').hasError('noIgual') &&  (this.formularioRegistro.get('confpassw').touched || this.formularioRegistro.get('confpassw').dirty);
  }

  get compararContrasenia(){
    const val1 = this.formularioRegistro.get('passw').value;
    const val2 = this.formularioRegistro.get('confpassw').value;

    if(val1 === val2){
      this.contraseniasIguales = false;
    }else{
      this.contraseniasIguales  =true;
    }
    return (val1 === val2) ? false : true;
  }

  //telefono
  get telfError(){
    return this.formularioRegistro.get('telf').hasError('required') && (this.formularioRegistro.get('telf').touched || this.formularioRegistro.get('telf').dirty);
  }
  get cantidadTelf(){
    return this.formularioRegistro.get('telf').hasError('minlength') && (this.formularioRegistro.get('telf').touched || this.formularioRegistro.get('telf').dirty);
  }

  //funcion para crear el formulario
  crearFormulario(){
    this.formularioRegistro = this._formBuilder.group({
      nombre   : ['', [Validators.required, Validators.minLength(5)]],
      apellido : ['', [Validators.required, Validators.minLength(5)]],
      cedula   : ['', [Validators.minLength(10), Validators.required, Validators.maxLength(10)]],
      telf     : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      correo   : ['', [Validators.required, Validators.minLength(5), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      passw    : ['', [Validators.required, Validators.minLength(10)]],
      confpassw: ['', [Validators.required, Validators.minLength(10)]],
    });
    /* this._formBuilder.group({
      
    }); */
  }

  //funcion para guardar los datos
  guardarDatos(registroUser: Registro){
    this._serviceFutbol.guardarDatos( registroUser );
  }
}
