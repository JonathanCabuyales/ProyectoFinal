  import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Camera, CameraDirection, CameraPermissionType, CameraResultType, CameraSource } from '@capacitor/camera';
import { FotosService } from '../../../services/fotos.service';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-subir-fotos',
  templateUrl: './subir-fotos.page.html',
  styleUrls: ['./subir-fotos.page.scss'],
})
export class SubirFotosPage implements OnInit {
  fotos: any[] = [];
  progreso: number = 0;
  constructor(
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private _fotos: FotosService,
    private _futbolInn: FutbolInnService,
    private _auth: AuthService,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  async cerrarModal(){
    await this._modalCtrl.dismiss();
  }
  

// funcion para fotos y camara
async fotosCamara(permiso: CameraPermissionType, mensaje: string, errormensaje: string){
  if(permiso === 'photos'){
    await this._toastCtrl.create({
      message: errormensaje,
      duration: 3500,
      buttons:['Omitir']
    }).then((res) =>{
      res.present();
    });
  }else{
    await this._toastCtrl.create({
      message: errormensaje,
      duration: 3500,
      buttons:['Omitir']
    }).then((res) =>{
      res.present();
    });
  }
}

// funcion para obtner foto
getPhoto(source: CameraSource){
  Camera.getPhoto({
    quality: 75,
    resultType: CameraResultType.Uri,
    source: source,
    correctOrientation: true,
    promptLabelCancel: 'Cancelar',
    promptLabelHeader: 'Seleccionar fotos',
    promptLabelPhoto: 'Desde galeria',
    saveToGallery: true
  })
  .then((r) =>{
    let dividir = r.webPath.split('/');
    this.fotos = [];
    this.fotos.unshift({path: r.path, webPath: r.webPath, formato: r.format, nombre: dividir[dividir.length - 1]});
    
  })
  .catch(async (err) =>{
    const toast = await this._toastCtrl.create({
      header: 'Fotos',
      message: err.message,
      buttons: ['omitir'],
      duration: 3500,
      position:'bottom',
      translucent: true,
    });

    await toast.present();
    
  });
}

// funcion para solicitar permisos
async requestPermisosFotoCamara(permiso: CameraPermissionType){
  const permisosFotos = await Camera.requestPermissions( { permissions: [permiso] } );

  switch (permiso) {
    case 'photos':
      
      if(permisosFotos.photos === 'granted'){
        this.getPhoto(CameraSource.Photos);
      }else if(permisosFotos.photos === 'denied'){
        this.fotosCamara('photos', 'Desea activar los permisos?', 'Debe ir a configuraciones para activar los permisos');
      }
      break;
  
    default:
      if(permisosFotos.camera === 'granted'){
        this.getPhoto(CameraSource.Camera);
      }else if(permisosFotos.camera === 'denied'){
        this.fotosCamara('camera', 'Desea activar los permisos?', 'Debe ir a configuraciones para activar los permisos');
      }
      break;
  }

}

  async abrirGaleriaCamara(){
    try {
    const permisosFotosCamara = await Camera.checkPermissions();
    
    
    if(permisosFotosCamara.photos === 'prompt'){
      this.requestPermisosFotoCamara('photos');
      
    }else if(permisosFotosCamara.photos === 'prompt-with-rationale'){
      this.requestPermisosFotoCamara('photos');

    }else if(permisosFotosCamara.photos === 'denied'){
      this.fotosCamara('photos', 'Desea activar los permisos?', 'Debe ir a configuraciones para activar los permisos');

    }else if(permisosFotosCamara.photos === 'granted'){
      this.getPhoto(CameraSource.Photos);
    }else{
      const toast = await this._toastCtrl.create({
        header: 'Fotos',
        message: 'Tiene el acceso limitado, active los permisos en configuraciones',
        buttons: ['omitir'],
        duration: 3500,
        position:'bottom',
        translucent: true,
      });

      await toast.present();
    }
    
    } catch (error) {
      const toast = await this._toastCtrl.create({
        header: 'Fotos',
        message: error.message,
        buttons: ['omitir'],
        duration: 3500,
        position:'bottom',
        translucent: true,
      });

      await toast.present();
    }
  }



  async abrirCamara(){
    try {
      const permisosFotosCamara = await Camera.checkPermissions();
      
      
      if(permisosFotosCamara.camera === 'prompt'){
        this.requestPermisosFotoCamara('camera');
        
      }else if(permisosFotosCamara.photos === 'prompt-with-rationale'){
        this.requestPermisosFotoCamara('camera');
        
  
      }else if(permisosFotosCamara.camera === 'denied'){
        this.fotosCamara('camera', 'Desea activar los permisos?', 'Debe ir a configuraciones para activar los permisos');
  
      }else if(permisosFotosCamara.camera === 'granted'){
        this.getPhoto(CameraSource.Camera);
      }else{
        const toast = await this._toastCtrl.create({
          header: 'Cámara',
          message: 'Tiene el acceso limitado, active los permisos en configuraciones',
          buttons: ['omitir'],
          duration: 3500,
          position:'bottom',
          translucent: true,
        });
  
        await toast.present();
      }
      
      
      } catch (error) {
        
      }
  }



  eliminarFoto(indice: number){
    this.fotos.splice(indice, 1);
  }

  async cargarImagenes(){
    const loading = await this._loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      showBackdrop: true,
      message: 'Subiendo foto....., espere por favor',
      spinner: 'crescent',
      translucent: true
    });
    const loadingExito = await this._loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      showBackdrop: true,
      message: 'Foto cargada correctamente',
      spinner: 'crescent',
      translucent: true
    });

    await loading.present();
    
    this._futbolInn.getUserByLocal(this._auth.usuario.uid)
    .subscribe(async (resp) =>{
      for(let r of resp.docs){
        await this._fotos.cargarImagenesFirebase(this.fotos, r.data().nombre+'_'+r.data().apellido)
        .then((resp) => {
          this.progreso = (resp.bytesTransferred / resp.totalBytes) * 100;
          
          
          resp.ref.getDownloadURL()
          .then(async (url) =>{
            loading.dismiss();
            
            await loadingExito.present();
            
            
            this._fotos.guardarUrl(url, r.id)
            .then(() =>{
              
              loadingExito.dismiss();
              this.fotos=[];
            })
            .catch((err) =>{
              
              loadingExito.dismiss();
              
            })
            
          })
          .catch((err) =>{
            loading.dismiss();
          })
        })
        .catch((err) =>{
          loading.dismiss();
        })
      }
    }, (err) =>{
      loading.dismiss();
    });
  }

}
