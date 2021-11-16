import { Component, OnInit, AfterContentInit } from '@angular/core';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { AuthService } from '../../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, NavController } from '@ionic/angular';
import { VerNotificacionPage } from '../ver-notificacion/ver-notificacion.page';
import firebase from 'firebase/app';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit, AfterContentInit {

  constructor(
    public _noti: NotificacionesService,
    private _auth: AuthService,
    private _angularAuth: AngularFireAuth,
    private _modalCtrl: ModalController,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    firebase.auth().onAuthStateChanged((user) =>{
      if(!user?.uid){
        this._navCtrl.navigateForward('/login');
      }
    })
  }

  ngAfterContentInit(){
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones(){
    this._angularAuth.currentUser
    .then((uid) =>{

      this._noti.obtenerNotificaciones(uid.uid, 'reservas cancelar')
      .subscribe(() => {
        
        
      });
    })
    .catch((err) =>{

    });
  }

  async verNotificaciones(id:string){
    
    const modal = await this._modalCtrl.create({
      component: VerNotificacionPage,
      componentProps: {
        idNoti: id
      },
      mode: 'ios',
      showBackdrop: true,
    });
    await modal.present();
    
  }

}
