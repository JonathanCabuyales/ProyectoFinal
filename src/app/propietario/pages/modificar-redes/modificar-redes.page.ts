import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Redes } from '../../../interfaces/interfaces.futbol';
import { AgregarRedesPage } from '../agregar-redes/agregar-redes.page';
import { PropietarioSService } from '../../../services/propietario-s.service';

@Component({
  selector: 'app-modificar-redes',
  templateUrl: './modificar-redes.page.html',
  styleUrls: ['./modificar-redes.page.scss'],
})
export class ModificarRedesPage {

  @Input() redes: Redes;
  @Input() eid: string;

  constructor(
    private _modalCtrl: ModalController,
    private _propService: PropietarioSService,
    private _toastCtrl: ToastController,
    private _loadingCtrl:LoadingController
  ) { }


  async agregarRedes(){
    const modalAgregar = await this._modalCtrl.create({
      component:AgregarRedesPage,
      componentProps:{
        red: this.redes,
        eid: this.eid
      }
    });
    await modalAgregar.present();

    const {data} = await modalAgregar.onDidDismiss();
    
    if(data.data.redes){
      this.redes = data.data;
    }else{
      this.redes = this.redes;
    }
    

  }

  async eliminar(red: any){
    const loadingCtrl =await this._loadingCtrl.create({
      message: 'Borrando....',
      backdropDismiss: false,
      showBackdrop: true,
      spinner: 'crescent',
      translucent: true
    });
    const toastCtrl = await this._toastCtrl.create({
      message: 'Red social borrado con exito',
      duration: 1200,
      buttons:[
        {
          side: 'start',
          icon: 'checkmark-done-outline',
          cssClass: 'verde'
        }
      ]
    });
    this._propService.getUbicaciones(this.eid)
    .subscribe((resp) =>{
      loadingCtrl.present();
      let dataBorrar: any = {};
      for(let f of resp.docs){
        dataBorrar = {
          redes: true,
          red: [
            ...f.data().redes.red.filter(b => b.name !== red.name)
          ]

        }
        this._propService.actualizarRedes(dataBorrar, f.id)
        .then(()=>{
          loadingCtrl.dismiss();
          toastCtrl.present();
          this.redes = dataBorrar;
        })
        .catch((err) =>{
          loadingCtrl.dismiss();
          
        })
      }

      
    }, (err) =>{
      loadingCtrl.dismiss();

    });
    
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
    
  }

}
