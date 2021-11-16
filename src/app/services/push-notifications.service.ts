import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(
    private _alertCtrl: AlertController
  ) { }

  configuracionInicial(){
   
  }

}
