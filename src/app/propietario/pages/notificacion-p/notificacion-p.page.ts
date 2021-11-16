import { Component, OnInit } from '@angular/core';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { AuthService } from '../../../services/auth.service';
import { NavController, ModalController } from '@ionic/angular';
import { InformacionClientePage } from '../informacion-cliente/informacion-cliente.page';
import firebase from 'firebase/app';
@Component({
  selector: 'app-notificacion-p',
  templateUrl: './notificacion-p.page.html',
  styleUrls: ['./notificacion-p.page.scss'],
})
export class NotificacionPPage implements OnInit {

  notificaciones: any = [];

  constructor(
    private _prop: PropietarioSService,
    public _noti: NotificacionesService,
    private _auth: AuthService,
    private _navCtrl: NavController,
    private _modalCtrl: ModalController
  ) { 
    
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    firebase.auth().onAuthStateChanged((user) =>{
      if(!user?.uid){
        this._navCtrl.navigateForward('/login');
      }
    });
    this.cargarNotificaciones();
  }

  cargarNotificaciones(){
    this._auth.currentUserFirebase()
    .then((uid) =>{
      this._prop.getUbicaciones(uid.uid)
      .subscribe((resp) =>{
        for(let id of resp.docs){
          this._noti.obtenerNotificacionesPropietario(id.id, 'reservas')
          .subscribe(() =>{
            this.notificaciones = (this._noti.notificacionesArr.filter(a => {
              if(a.data.fecha >= new Date().getTime()){
                return a;
              }
              
            }));
            console.log(this.notificaciones);
            
            
          })
        }
      }, (err) =>{

      });
    })
    .catch((err) =>{

    });
  }

  async verReserva(notificacion: any){
    console.log(notificacion);
    
    const modal = await this._modalCtrl.create({
      component: InformacionClientePage,
      componentProps:{
        idReserva: notificacion.data.data.idReserva,
        idDocLocal: notificacion.data.para
      }
    });

    await modal.present();

  }

}
