import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ModalController } from '@ionic/angular';
import { ModificarPage } from '../modificar/modificar.page';
import { AuthService } from '../../../services/auth.service';
import { SubirFotosPage } from '../../pages/subir-fotos/subir-fotos.page';

@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.page.html',
  styleUrls: ['./perfil-user.page.scss'],
})
export class PerfilUserPage implements OnInit, AfterViewInit {
  
  constructor(
    public _futbolInn: FutbolInnService,
    private _modalCtrl: ModalController,
    private _auth: AuthService,

  ) { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    this.getDataUser();
  }


  getDataUser(){
        this._futbolInn.getUserByIdDoc(this._auth.usuario.uid)
        .subscribe();
  }

  async editField( campo: string, valor: string ){
    const modal = await this._modalCtrl.create({
      component: ModificarPage,
      componentProps: {
        campo: campo.toLowerCase(),
        valor
      }
    });
    await modal.present();

    await modal.onWillDismiss()
    .then(() => {
      
          this._futbolInn.getUserByIdDocPerfil(this._auth.usuario.uid)
          .subscribe()
      
    }).catch(erro => {
      
      
    });
  }

  

  async subirFotos(){
    const modal = await this._modalCtrl.create({
      component: SubirFotosPage
    });
    await modal.present();

    await modal.onWillDismiss()
    .then(() =>{
      this._futbolInn.getUserByIdDocPerfil(this._auth.usuario.uid)
      .subscribe()
    })
    .catch((err) =>{
      
      
    })
  }


  /* notificacionHoraExacta(a:any){
    LocalNotifications.schedule(
      {
        notifications: [{
          title: 'Recordatorio',
          body:  'Reserva',
          largeBody: `Espero este disfrutando del partido de futbol que ha reservado, para las ${ a.horaInicio }`,
          id: (Math.random()*100),
          schedule: {
           allowWhileIdle: true,
           repeats: true,
           at: new Date(Number.parseInt(a.fechaReserva.slice(0,4)), Number.parseInt(a.fechaReserva.slice(5,7)), (Number.parseInt(a.diaFecha) -1), Number.parseInt(a.horaInicio.slice(0,2)), 0, 0),
           count: 1,
           every: 'hour'
          }
        }]
      }
    );
  } */

}
