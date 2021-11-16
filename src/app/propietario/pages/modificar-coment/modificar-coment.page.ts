import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ComentariosService } from '../../../services/comentarios.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modificar-coment',
  templateUrl: './modificar-coment.page.html',
  styleUrls: ['./modificar-coment.page.scss'],
})
export class ModificarComentPage implements OnInit {
  @Input() uidLocal: string;
  @Input() uidUser: string;


  constructor(
    private _modal: ModalController,
    public _coment: ComentariosService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getComentarioLocal();
  }

  cerrarModal(){
    this._modal.dismiss();
  }

  getComentarioLocal(){
    this._coment.editComentarioEstablecimiento(this.uidLocal, this.uidUser)
    .subscribe(() => {
      
      
      
    })
  }

  async modificar(comentUser: any, valor: string){
    const toast = await this._toastCtrl.create({
      animated: true,
      message: 'El comentario actualizado correctamente',
      duration: 2500,
      buttons: ['aceptar'],
      position:'middle',
      translucent: true
    })
    
    if(valor.length === 0){
      await this._toastCtrl.create({
        message: 'El campo comentario no puede estar vacio',
        duration: 2500,
        buttons: ['aceptar']
      }).then((resp) =>{
        resp.present();
      });
    }else{
      let dataLocal= {
        fecha: moment().format("YYYY-MM-DD"),
        hora: moment().format("HH:mm:ss"),
        resp: true,
        comentario: valor
      }
      
      this._coment.getIdDocComentario(this.uidLocal, this.uidUser)
      .subscribe(() =>{
        
        this._coment.actualizarComentarioLocal(comentUser ,this._coment.idDocComentarios, dataLocal)
        .then(() => {
          
          toast.present();
          setTimeout(() => {
            this._modal.dismiss();
          }, 500);
        })
      })
    }
  }
  cancelar(){
    this._modal.dismiss();
  }

}
