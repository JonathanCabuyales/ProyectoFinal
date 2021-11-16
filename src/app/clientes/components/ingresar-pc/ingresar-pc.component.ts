import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ingresar-pc',
  templateUrl: './ingresar-pc.component.html',
  styleUrls: ['./ingresar-pc.component.scss'],
})
export class IngresarPCComponent implements OnInit {

  @Input() uid:string;
  @Input() campo:string;

  constructor(
    private _modalCtrl: ModalController,
    private _auth: AuthService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
    
    
    
  }

  async pass(valorPass: any){
    const toast = await this._toastCtrl.create({
      message: 'Autenticado',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-done-outline',
          text: 'Aceptar',
          handler:() => {
            toast.dismiss();
          }
        }
      ]
    })
    const toastdismis = await this._toastCtrl.create({
      message: 'Contraseña incorrecta',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-done-outline',
          text: 'Aceptar',
          handler:() => {
            toast.dismiss();
          }
        }
      ]
    })
    
    this._auth.reautenticar(valorPass)
    .then( () => {
      toast.present();
      setTimeout(() => {
        this._modalCtrl.dismiss({
          'actualizado': true
        })
      }, 1500);
      
    }).catch( () => {
      
      toastdismis.present();
    })
    
  }

  cerrarModal(){
    this._modalCtrl.dismiss({
      'actualizado': false
    });
  }

}
