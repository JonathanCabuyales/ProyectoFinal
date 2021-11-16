import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {

  recuperarPass: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _toastCtrl: ToastController,
    private _navCtrl: NavController
  ) { 
    this.crearFormulario();
  }

  ngOnInit() {
  }

  async onSubmit(valorFormulario: FormGroup){
    const toast = await this._toastCtrl.create({
      header: 'Reestablecer contraseña',
      message: `Se ha enviado un correo a ${ valorFormulario.value.email }`,
      position: 'middle',
      translucent: true,
      duration: 3500,
      buttons: [{
        icon: 'close-circle-outline',
        role: 'aceptar',
        side:'end',
        text:'aceptar',
        handler: () =>{
          this._navCtrl.navigateBack('/login');
        }
      }]
    });
    
    this._auth.resetPassword(valorFormulario.value.email)
    .then((resp) => {
      toast.present();
      setTimeout(() => {
        this._navCtrl.navigateBack('/login');
      }, 3500);
    }).catch((errno) => {
    });
  }

  async crearFormulario(){
    this.recuperarPass = this._fb.group({
      email: [, [Validators.email, Validators.required]]
    });
  }

}
