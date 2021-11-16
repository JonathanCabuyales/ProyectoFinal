import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ComentariosService } from '../../../services/comentarios.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import * as moment from 'moment';
import { StarRatingComponent } from 'ng-starrating';

@Component({
  selector: 'app-modificar-comentario',
  templateUrl: './modificar-comentario.page.html',
  styleUrls: ['./modificar-comentario.page.scss'],
})
export class ModificarComentarioPage implements OnInit, OnDestroy {

  @Input() uidLocal: string;
  @Input() uidUser: string;

  valorRating: number;

  constructor(
    private _modalCtrl: ModalController,
    public _cometario: ComentariosService,
    private _storage: AlmacenamientoService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getDataComentario();
    console.log(this._cometario.modificarComentario);
    this.getIdDoc();
    
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  getDataComentario(){
    this._cometario.editComentarioEstablecimiento(this.uidLocal, this.uidUser)
    .subscribe(() => {
      this.valorRating = this._cometario.modificarComentario.comentarios.comentUser.valorCalificacion;
    });
  }

  getIdDoc(){
    this._cometario.getIdDocComentario(this.uidLocal, this.uidUser)
    .subscribe( () => {
      this._storage.set('IdDocComentario', this._cometario.idDocComentarios);
    });
  }

  calificar(evento:{oldValue:number, newValue:number, starRating: StarRatingComponent}){
    console.log(evento);
    
    if((evento.newValue === 1 && evento.oldValue === 1) && evento.newValue === evento.oldValue){
      this.valorRating = 0;
    }else if(evento.newValue === evento.oldValue){
      this.valorRating = evento.starRating.value - 1;
    }
    else{
      this.valorRating = evento.starRating.value;
    }
  }

  async actualizarComent(valor: string){
    const toast = await this._toastCtrl.create({
      header: 'Guardando....',
      message: 'Comentario actualizado correctamente',
      duration: 2500,
      position: 'middle',
      translucent: true,
      buttons: ['aceptar']
    });
    if(valor.length === 0){

    }else{
      
      let data ={
          comentario: valor,
          fecha: moment().format('YYYY-MM-DD'),
          hora: moment().format('HH:mm:ss'),
          valorCalificacion: this.valorRating
      }
      
      
      this._cometario.actualizarComentario(data, this._cometario.idDocComentarios)
      .then( () => {
        
        toast.present();
        setTimeout(() => {
          this._modalCtrl.dismiss();
        }, 500);
      })
      .catch((err) =>{

      });
    }

  }

  ngOnDestroy(){
    this._storage.limpiarKey('IdDocComentario');
  }

}
