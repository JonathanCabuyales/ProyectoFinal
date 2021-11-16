import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Redes } from '../../../interfaces/interfaces.futbol';



@Component({
  selector: 'app-agregar-redes',
  templateUrl: './agregar-redes.page.html',
  styleUrls: ['./agregar-redes.page.scss'],
})
export class AgregarRedesPage implements OnInit {

  redesSocialesForm:FormGroup;
  objReturn: any;
  @Input() red: Redes;
  @Input() eid: string;
  deshabilitar = false;
  dataRed: any = {};
  valorUrl: string = "";
  placeHolder: string = "";
  quitar: string="";
  idDocUbicaciones: string = "";
  customOptions: any = {
    header: 'Redes sociales',
    subHeader: 'seleccione una red social',
    translucent: true,
  };
  tamanioRed: number = 0;
  remplazo: any[] = [];

  redesDefault:any[] = [
    {
      name: 'facebook',
      logo: 'logo-facebook',
      color: 'facebook',
      url: 'https://www.facebook.com/',
      usuario: 'Usuario de facebook'
    },
    {
      name: 'instagram',
      logo: 'logo-instagram',
      color: 'instagram',
      url: 'https://www.instagram.com/',
      usuario: 'Usuario de instagram'
    },
    {
      name: 'twitter',
      logo: 'logo-twitter',
      color: 'twitter',
      url: 'https://www.twitter.com/',
      usuario: 'Usuario de twitter'
    },
    {
      name: 'youtube',
      logo: 'logo-youtube',
      color: 'google',
      url: 'https://www.youtube.com/c/',
      usuario: 'Usuario de youtube'
    },
    {
      name: 'tiktok',
      logo: 'logo-tiktok',
      color: 'tiktok',
      url: 'https://www.tiktok.com/@',
      usuario: 'Usuario de tiktok'
    },
    {
      name: 'sitio-web',
      logo: 'logo-soundcloud',
      color: 'web',
      url: 'https://www.',
      usuario: 'Nombre del dominio'
    }
  ]
  constructor(
    private _modalCtrl: ModalController,
    private _fb: FormBuilder,
    private _propService: PropietarioSService,
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    
    this.crearFormulario();
  }

  cargarRedes(){
    this._propService.getUbicaciones(this.eid)
    .subscribe((resp) =>{
      for(let f of resp.docs){
        for(let a of f.data().redes.red){
          this.redesDefault = (this.redesDefault.filter( b =>{
            return b.name !== a.name;
          }));
        }
        this.idDocUbicaciones = f.id;
        this.tamanioRed = f.data().redes.red.length;
      }

      
    });
  }

  cambiar(e: any){  
    this.quitar = "";
    let red : string = e.target.value;
     this.objReturn = this.redesDefault.find(a => {
        return a.name === red;
      }
    );
    this.valorUrl = this.objReturn.url;
    this.placeHolder = this.objReturn.usuario;
    this.redesSocialesForm.reset();
    
  }

  

  async agregar(){
    let valor = this.redesSocialesForm.get('redesSocialesNuevas').value[0];
    const loadingCtrl = await this._loadingCtrl.create({
      message: 'Guardando Datos, espere por favor',
      backdropDismiss: false,
      showBackdrop: true,
      translucent: true,
      spinner: 'crescent',
    });
    const toastCrtl = await this._toastCtrl.create({
      message: 'Datos guardados correctamente',
      position: 'bottom',
      translucent: true,
      duration: 1500
    });
    
    let agregar = {
      color: this.objReturn.color,
      icon: this.objReturn.logo,
      name: this.objReturn.name,
      value: this.objReturn.url + valor
    }
    this.dataRed = {
      redes: true,
      red:[...this.red.red, agregar]
    }
    loadingCtrl.present();
    if(this.tamanioRed > 0){

      

      this._propService.actualizarRedes(this.dataRed, this.idDocUbicaciones)
      .then(() =>{
        loadingCtrl.dismiss();
        toastCrtl.present();
        this.formArrayRed.clear();
        this.deshabilitar = !this.deshabilitar;
        
        
      }).catch((err) =>{
        loadingCtrl.dismiss();
        this.formArrayRed.clear();
        this.deshabilitar = !this.deshabilitar;
        
        
        
      });
      
    }else{

      this._propService.agregarRedes(this.dataRed, this.idDocUbicaciones)
      .then(() =>{
        loadingCtrl.dismiss();
        toastCrtl.present();
        this.formArrayRed.clear();
        this.deshabilitar = !this.deshabilitar;
      })
      .catch((err) =>{
        loadingCtrl.dismiss();
        this.formArrayRed.clear();
        this.deshabilitar = !this.deshabilitar;
      });
    }
    
    
    
  }
  cancelar(form: any){
    this.deshabilitar = !this.deshabilitar;
    this.formArrayRed.controls.forEach( (r, index) => {
      if(index === form){
        this.formArrayRed.controls.splice(index, 1);
      }
    });
  }
  get formArrayRed(){
    return this.redesSocialesForm.get('redesSocialesNuevas') as FormArray;
  }

  crearFormulario(){
    this.redesSocialesForm = this._fb.group({
      redesSocialesNuevas: this._fb.array([])
    });
  }

  agregarRed(){
    this.idDocUbicaciones = "";
    this.tamanioRed = 0;
    this.deshabilitar = !this.deshabilitar;
    this.cargarRedes();
    
    this.formArrayRed.push( this._fb.control(''));
  }

  cerrarModal(){
    this._modalCtrl.dismiss({
      data: this.dataRed
    });
  }

}