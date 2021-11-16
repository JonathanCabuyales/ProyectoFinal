import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ModalController } from '@ionic/angular';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { notificaciones } from '../../../interfaces/chat.interface';

@Component({
  selector: 'app-ver-notificacion',
  templateUrl: './ver-notificacion.page.html',
  styleUrls: ['./ver-notificacion.page.scss'],
})
export class VerNotificacionPage implements OnInit, AfterContentInit {

  @Input() idNoti: string;
  canceladas: any[] = [];
  constructor(
    private _noti: NotificacionesService,
    private _modalCtrl: ModalController,
    private _futbol: FutbolInnService
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit(){
    this.getNotificaciones();
  }


  getNotificaciones(){
    this._noti.getNotificacinById(this.idNoti)
    .subscribe((resp) =>{
      
      for(let uid of resp.docs){

        this._futbol.getReservasByUserNotificaciones(uid.data().para)
        .subscribe((notificaciones) =>{
          this.canceladas = [];
          for(let noti of notificaciones.docs){
            
            this.canceladas.push({data: noti.data().dataReserva.filter(a => (a.activo === false && a.cancelacion.cancelado === true && a.id === uid.data().data.idReserva)), notifi: uid.data()})
          }
          
          
          
        }, (err) =>{

        });
      }
    }, (err) =>{

    });
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

}
