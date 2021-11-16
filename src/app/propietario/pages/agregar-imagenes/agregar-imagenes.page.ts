import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FotosService } from '../../../services/fotos.service';
import { RespUbicaciones } from 'src/app/interfaces/interfaces.futbol';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-agregar-imagenes',
  templateUrl: './agregar-imagenes.page.html',
  styleUrls: ['./agregar-imagenes.page.scss'],
})
export class AgregarImagenesPage implements OnInit {
  @Input() local: RespUbicaciones;
  fotos:any[] = [];
  progreso: number = 0;
  colores: string = "primary";
  constructor(
    private _alertCtrl : AlertController,
    private _modalCtrl: ModalController,
    private _fotos: FotosService,
    private _propService: PropietarioSService,
    private _loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    
    
  }
  async cerrarModal(){
    const alert = await this._alertCtrl.create({
      message: '¿Seguro que desea salir?',
      backdropDismiss:false,
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => {
            this._modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async seleccionarImg(){
    await Camera.checkPermissions()
    .then(async (r) =>{
      if((r.camera === 'denied' || r.camera === 'limited') && (r.photos === 'denied' || r.photos === 'limited')){
        await Camera.requestPermissions({permissions: ['camera', 'photos']});
      }
      if(r.camera === 'granted' && r.photos === 'granted'){
        await Camera.getPhoto({
          quality: 50,
          resultType: CameraResultType.Uri,
          saveToGallery: true,
          promptLabelCancel: "Cancelar",
          promptLabelHeader: "Seleccionar Fotos",
          promptLabelPhoto: 'Desde galeria',
          promptLabelPicture: 'Desde Camara',

        })
        .then((foto) =>{
          let dividir = foto.webPath.split('/');
          
          if(this.fotos.length === 3){
            this.fotos.push({path: foto.path, webPath: foto.webPath, nombre: dividir[dividir.length - 1], formato: foto.format});
          }else{
            this.fotos.push({path: foto.path, webPath: foto.webPath, nombre: dividir[dividir.length - 1], formato: foto.format});
          }
        })
        .catch((err) =>{
          
          this.fotos = [];
        });
      }
    })
    .catch((err) =>{

    })
  }

  eliminarFoto(i: number){

    this.fotos.splice(i, 1);

  }
  async cargarImagenes(){
    let nombreLocal = this.local.nomLocal.split(' ');
    let nombreUnir = nombreLocal.join('_');
    
    let loading: any;
    
    const loadingExito = await this._loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      showBackdrop: true,
      message: 'Fotos cargada correctamente',
      spinner: 'crescent',
      translucent: true
    });
    
    
    this._fotos.cargarImagenesLocalFirebase(this.fotos, nombreUnir)
    .then((task: AngularFireUploadTask[])=>{
      
      for(let t of task){
        t.then(async (r) =>{
          this.progreso = (r.bytesTransferred / r.totalBytes) * 100;
          
          loading = await this._loadingCtrl.create({
            animated: true,
            backdropDismiss: false,
            showBackdrop: true,
            message: `Subiendo fotos....., espere por favor ${ this.progreso} %`,
            spinner: 'crescent',
            translucent: true
          });
          loading.present()
        })
        .catch((err) =>{

        });
        t.then((r) =>{
          r.ref.getDownloadURL()
          .then((url) =>{
            
            this._propService.getIdDocOfUbicaciones(this.local.eid)
            .subscribe(async () =>{
              loading.dismiss();
              
              
              loadingExito.present();
              
              this._fotos.guardarUrlUbicaciones(url, this._propService.idDocReserva)
              .then(() =>{
                
                loadingExito.dismiss();
                this.fotos = [];
              })
              .catch((err) =>{
                
                loadingExito.dismiss();
                this.fotos = [];
                
              })
              
            }, (err) =>{
              
              loading.dismiss();
              loadingExito.dismiss()
              this.fotos = [];
              
              
            })
            
          }).catch((err) =>{
            loading.dismiss();
            loadingExito.dismiss()
            this.fotos = [];
            
          })
        }).catch((err) =>{
          loading.dismiss();
          loadingExito.dismiss()
          this.fotos = [];

        })
      }
      
      /* this.progreso = (task / task.totalBytes) * 100;
      task.ref.getDownloadURL()
      .then((url) =>{
        
        
      })
      .catch((err) =>{
        
        
      }) */
    });
    }

}
