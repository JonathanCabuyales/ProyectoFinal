import { Component, AfterContentInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { AlmacenamientoService } from '../../services/almacenamiento.service';
import { FutbolInnService } from 'src/app/services/futbol-inn.service';
import { combineLatest } from 'rxjs';
import { SplashScreen } from "@capacitor/splash-screen";
import { Network } from "@capacitor/network";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterContentInit, AfterViewInit {

  formularioLogin: FormGroup;
  errnoCorreo: string;
  errorCredenciales = false;
  checkSelected = false;
  tipo: string = "";
  limiteIntentos: number = 5;
  cancelarBoton:boolean = false;
  intentos: string = "";
  constructor(
    private _fBuilder: FormBuilder,
    private _serviceAuth: AuthService,
    private _loadingCtrl: LoadingController,
    private _router: NavController,
    private _storage: AlmacenamientoService,
    private _futbol: FutbolInnService,
    private _menu: MenuController,
    private _toastCtrl: ToastController,
    private _platform: Platform
  ) {

    this.crearFormulario();
    
   }
   
  ngAfterContentInit(){
    this._serviceAuth.cargarUsuario()
    .then((user) =>{
      //
      user.subscribe((r) =>{
        
        if(!r){
          this._menu.enable(false, 'cliente');
          this._menu.enable(false, 'propietario');
          this._menu.close('propietario');
          this._menu.close('cliente');
          this._menu.swipeGesture(false, 'cliente');
          this._menu.swipeGesture(false, 'propietario');
        }
      }, (err) =>{

      })
      
    })
    .catch((err) =>{
      
      
    });
  }

  redireccionar(){
    setTimeout(async () => {
      await this.verificarUsuario();
    }, 400);
  }
  
  
  async ngAfterViewInit(){
    await this._platform.ready();
    const status = await Network.getStatus();
    
    
    switch (status.connected && status.connectionType) {
      case 'wifi':
        this.redireccionar();
        break;

        case 'cellular':
          const toast = await this._toastCtrl.create({
            header: 'Esta conectado con datos móviles.',
            message: 'Utilice wifi para una mejor conexión y estabilidad',
            position: 'middle',
            translucent: true,
            duration: 3500,
            buttons: ['Aceptar']
          });
          toast.present();
          this.redireccionar();
          break;  
      default:
        break;
    }


  }

  

  async ionViewDidEnter(){
    SplashScreen.hide();

    const status = await Network.getStatus();
    
    switch (status.connectionType) {
      case 'wifi':
        this.dataLogin();
        break;

        case 'cellular':
          this.dataLogin();
          break;


          case 'none':
            const toastnone = await this._toastCtrl.create({
              header: 'No tiene conexión wifi',
              message: 'Active el wifi o los datos para utilizar la aplicación',
              position: 'middle',
              translucent: true,
              duration: 3500,
              buttons: ['Aceptar']
            });

            toastnone.present();    
      default:
        const toastdef = await this._toastCtrl.create({
          header: 'No tiene conexión wifi',
          message: 'Active el wifi o los datos para utilizar la aplicación',
          position: 'middle',
          translucent: true,
          duration: 3500,
          buttons: ['Aceptar']
        });

        toastdef.present();
        break;
    }
    
  }

  dataLogin(){
     this._storage.getData('login')
    .then((lg) =>{
      
      let fb = JSON.parse(lg);
      if(fb !== null){
        this.formularioLogin.get('correo').setValue(fb.email);
        this.formularioLogin.get('passw').setValue(fb.pass);
      }
      
    });
  }

  error(){
    this.errnoCorreo = "";
    this.errorCredenciales = false;
  }

  //funcion para saber si existe usuario logeado
  async verificarUsuario(){
      const loading = await this._loadingCtrl.create({
        message: 'Redireccionando... Espere por favor',
        spinner: 'bubbles',
        backdropDismiss: true,
        showBackdrop: true
      });
      
    // setTimeout(() => {
      
      try {
          combineLatest([
            this._storage.getLength(),
            this._storage.getData('omitirSlides'),
            this._storage.getData('omitirSlidesP'),
            this._storage.getData('login')
          ])
          .subscribe(async ([length,omitir, omitirP, firebase]) => {
            let fb = JSON.parse(firebase);
            
            if(fb){
              await loading.present();
              this._serviceAuth.authLogin(fb.email, fb.pass)
              .then((tk) =>{
                
                if(tk && length.length > 0){
                  this._futbol.getUserByLocal(tk.user.uid)
                  .subscribe( (r) => {
                    
                    if(!r.empty){
                      
                      for(let f of r.docs){
                        if( f.data().tipo === "user"){
                          if(omitir !== null){
                            loading.dismiss();
                            this._router.navigateForward('/tabs-cliente/ubicaciones');
                          }else{
                            
                            loading.dismiss();
                            this._router.navigateForward('slides');
                          }
                        }else if(f.data().tipo === 'admin'){
                          
                          if( omitirP !== null){
                            
                            loading.dismiss();
                            this._router.navigateForward('/tabs-propietario/pricipal-reservas');
                          }else{
                            
                            loading.dismiss();
                            this._router.navigateForward('slides-prop');
                          }
                      }
                      }
                    }
                    
                  }, (errno) => {
                    
                    loading.dismiss();
                    
                  });
                }
              });
            }
            
            
          }, (errno) =>{
            loading.dismiss();
            
          });
      } catch (error) {
        
        loading.dismiss();
      }
    // }, 200);
  }

  //funcion para acceder

  async loginAcceder(){
    const red = await Network.getStatus();
    switch (red.connectionType) {
      case 'cellular':
        const toast = await this._toastCtrl.create({
          header: 'Mejorar conexión',
          message: 'Se recomienda el uso de wifi, ya que está usando datos móviles',
          position: 'middle',
          translucent: true,
          duration: 3500,
          buttons: ['Aceptar']
        });
        toast.present();
        this.login();
        break;

        case 'wifi':
          this.login();
          break;
    
      default:
        const toastdef = await this._toastCtrl.create({
          header: 'No tiene conexión wifi',
          message: 'Active el wifi o los datos para utilizar la aplicación',
          position: 'middle',
          translucent: true,
          duration: 3500,
          buttons: ['Aceptar']
        });

        toastdef.present();
        break;
    }
  }
  async login(){
    
    let recordar = this.formularioLogin.get('recordar').value;
    
    const cargando = await this._loadingCtrl.create({
      message: 'Verificando datos, espere por favor',
    });

    const cargandoComponentes = await this._loadingCtrl.create({
      message: 'Datos correctos, cargando componentes'
    });
    let correo = this.formularioLogin.get('correo').value;
    let passw = this.formularioLogin.get('passw').value;
    
    
    
    if( this.formularioLogin.invalid ){
      return Object.values( this.formularioLogin.controls ).forEach( validator => {
        validator.markAsTouched();
      });
      
    }
    
    await cargando.present();

      try {
        combineLatest([
          this._serviceAuth.authLogin( correo, passw ),
          this._storage.getData('omitirSlides'),
          this._storage.getData('omitirSlidesP')
        ])
        .subscribe(([authLogin, omitir, omitirP]) => {
          console.log(authLogin);
          
          this._futbol.getUserByIdDoc(authLogin['user'].uid)
          .subscribe(async () => {
            this.tipo = this._futbol.tipo;
            if(authLogin){
              if(recordar){
                await this._storage.set('login', JSON.stringify({email: correo, pass: passw}));
              }
              if(this.tipo === "user"){
                this.errorCredenciales = false;
                
                cargando.dismiss();
                cargandoComponentes.present();
                if(omitir !== null){
                  setTimeout(() => {
                    cargandoComponentes.dismiss()
                    this._router.navigateForward('/tabs-cliente/ubicaciones');
                  }, 800);
                }else{
                  cargandoComponentes.dismiss()
                  this._router.navigateForward('slides');
                }
              }else{
                this.errorCredenciales = false;
                cargando.dismiss();
                cargandoComponentes.present();
                if(omitirP === null){
                  cargandoComponentes.dismiss()
                  this._router.navigateForward('slides-prop');
                }else{
                  cargandoComponentes.dismiss()
                  this._router.navigateForward('/tabs-propietario/pricipal-reservas');
                    
                }
              }
              
  
            }
          }, (errno) => {
            
            
          });
  
          
        }, (errno) => {
          cargando.dismiss();
          if(errno.code === "auth/wrong-password"){
            this.errnoCorreo = "";
            this.errorCredenciales = true;
            this.errnoCorreo = "Correo y/o contraseña incorrectos";
            
          }else if(errno.code === "auth/user-not-found"){
            
            this.errnoCorreo = "";
            this.errorCredenciales = true;
            this.errnoCorreo = "Correo y/o contraseña incorrectos";
            
          }else if(errno.code === "auth/too-many-requests"){
            this.errnoCorreo = "";
            this.errorCredenciales = true;
            this.errnoCorreo = `El acceso a ${correo} ha sido desabilitado, debido a demasiados intentos de acceso. Puedes reestablecer la contraseña o intentarlo más tarde`;
            
          }
          
          
        });
      } catch (error) {
        
        
      }
      

  }

  //funcion para crear el formulario
  crearFormulario(){
    this.formularioLogin = this._fBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      passw: ['', [Validators.required, Validators.minLength(8)]],
      recordar: [false]
    });
  }

  //funciones para los erroes
  get errorCorreo(){
    return  this.formularioLogin.get('correo').hasError('required') && (this.formularioLogin.get('correo').touched || this.formularioLogin.get('correo').dirty);
  }

  get correNoValido(){
    return  this.formularioLogin.get('correo').hasError('email') && (this.formularioLogin.get('correo').touched || this.formularioLogin.get('correo').dirty);
  }
  get errorPassw(){
    return  this.formularioLogin.get('passw').hasError('required') && (this.formularioLogin.get('passw').touched || this.formularioLogin.get('passw').dirty);
  }
  get errorNoPassw(){
    return  this.formularioLogin.get('passw').hasError('minlength') && (this.formularioLogin.get('passw').touched || this.formularioLogin.get('passw').dirty);
  }

  valor(ev:any){
    const checked = ev.detail.checked;

    return checked;
    
    
  }

}
