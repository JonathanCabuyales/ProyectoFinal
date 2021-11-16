import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PropietarioSService } from '../../../services/propietario-s.service';

@Component({
  selector: 'app-modificar-datos',
  templateUrl: './modificar-datos.page.html',
  styleUrls: ['./modificar-datos.page.scss'],
})
export class ModificarDatosPage implements OnInit, OnDestroy {
  @Input() campoEditar: string = "";
  @Input() campoValor: string = "";
  @Input() eidLocal: string = "";
  constructor(
    private _modalCtrl: ModalController,
    private _propService: PropietarioSService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  async modificar(dataCambiar: any){
    const toast = await this._toastCtrl.create({
      message: `Dato ${this.campoEditar} actualizado correctamente`,
      duration: 2000,
      buttons: [
        {
          text: 'Aceptar',
          icon: 'checkmark-done-outline',
          side: 'end',
          role: "aceptar"
        }
      ]
    });
    let dataModificar = new Object();
    if(dataCambiar.name === 'nombre local'){
      
      dataModificar['nomLocal'] = dataCambiar.value;
    }else if(dataCambiar.name === 'Canchas'){
      dataModificar['numCanchas'] = Number.parseInt(dataCambiar.value);
    }else{
      
      dataModificar[dataCambiar.name] = dataCambiar.value;
    }

    /* this._propService.actualizarDataLocal(dataModificar, ) */
    this._propService.getIdDocOfUbicaciones(this.eidLocal)
    .subscribe( () => {
      this._propService.actualizarDataLocal(dataModificar,this._propService.idDocReserva)
      .then( () =>{
        toast.present();
        
        setTimeout(() => {
          this._modalCtrl.dismiss();
        }, 2000);
        
      })
    })
    
    
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  ngOnDestroy(){
    
  }
}
