import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ComentariosService } from "../../../services/comentarios.service";
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { StarRatingComponent } from 'ng-starrating';

@Component({
  selector: 'app-modal-comentario',
  templateUrl: './modal-comentario.page.html',
  styleUrls: ['./modal-comentario.page.scss'],
})
export class ModalComentarioPage implements OnInit {
  @Input() idDoc: string;
  nombreLocal: string = "";
  nombreUser: string = "";
  valorStar = 0;
  uidUser: string = '';
  uidLocal: string = '';

  constructor(
    private _modalCtrl: ModalController,
    private _storage: AlmacenamientoService,
    private _futbol: FutbolInnService,
    private _comentariosS: ComentariosService,
    private _auth: AuthService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getNombreEstablecimiento();
    this.getNombreUsuario();
    
    
    
  }

  //funcion para traer los comentarios
  getComentarios(){
    
  }

  getNombreEstablecimiento(){
    
        this._storage.getData('idDocLocal')
        .then( respId => {
          this.uidLocal = respId;
          this._futbol.getSearchEstablecimiento(respId)
          .subscribe( dataLocal => {
    
            this.nombreLocal = dataLocal.data().nomLocal;
          });
        });
      
  }

  getNombreUsuario(){
    
        this._futbol.getUserByIdDoc(this._auth.usuario.uid)
        .subscribe( () => {
          this.uidUser = this._futbol.idDoUser;
          this.nombreUser = this._futbol.nombre +' '+ this._futbol.apellido;
        });
      
    
  }

  //funcion para estrellas
  

  calificar( evento: {oldValue:number, newValue:number, starRating:StarRatingComponent} ){
    
    if(evento.newValue === 1 && evento.oldValue === 1){
      this.valorStar = 0;
    }else if(evento.newValue === evento.oldValue){
      this.valorStar = evento.starRating.value - 1;
    }
    else{
      this.valorStar = evento.starRating.value;
    }
  }

  //funcion para guardar comentarios
  async guardarComentario( valor: string ){
    const toast = await this._toastCtrl.create({
      message: 'Comentario guardado correctamente',
      duration: 2500,
      animated: true,
      header: 'Guardado',
      position: 'middle',
      translucent: true,
      buttons: ['aceptar'],
    });
    if(valor.length === 0){
      
    }else{
      let dataInfo = {
        uidUser: this.uidUser,
        uidLocal : this.uidLocal,
        nomLocal: this.nombreLocal,
        nomUser: this.nombreUser
      }
      let comentario = {
        fecha: moment().format('YYYY-MM-DD'),
        hora: moment().format('HH:mm:ss'),
        valorCalificacion: this.valorStar,
        comentario: valor
      }
      
      this._comentariosS.guardarComentario(dataInfo, comentario)
      .then( resp => {
        
        toast.present();
        setTimeout(() => {
          this._modalCtrl.dismiss();
        }, 400);
    });
    }
    
    
  }

  cerrarModal(){
   this._modalCtrl.dismiss();
  }

}
