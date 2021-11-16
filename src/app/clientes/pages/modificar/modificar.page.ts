import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { IngresarPCComponent } from '../../components/ingresar-pc/ingresar-pc.component';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  @Input() campo: string;
  @Input() valor: string;

  passUser: string;
  passBoolean = false;

  constructor(
    private _modalCtrl: ModalController,
    private _storage: AlmacenamientoService,
    private _futbol: FutbolInnService,
    private _toastCtrl: ToastController,
    private _auth: AuthService,
    
  ) { }

  ngOnInit() {
    //
    this.getPassOfUser();
    
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  getPassOfUser(){
    
      this._futbol.getUserByIdDoc(this._auth.usuario.uid)
      .subscribe(() => {
        this.passUser = this._futbol.datosPersonales[0].contrasenia;
      });
     
    /* this._storage.getData('dataLogin')
    .then( resp => {
      this._futbol.getUserByIdDoc(resp.uid)
      .subscribe( () => {
        this.passUser = this._futbol.datosPersonales[0].contrasenia;
      });
    }); */
  }

  async modificar( idCampo: any ){
    
    
    const alert = await this._toastCtrl.create({
      message: `<ion-icon slot="icon-only" name="alert-circle-outline"></ion-icon> Dato actualizado correctamente.`,
      position: 'middle',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-done-outline',
          text: 'Aceptar',
          handler:() => {
            alert.dismiss();
          }
        }
      ]
    });
    
    
    let dataInfo = new Object();
    dataInfo[idCampo.name] = idCampo.value;
    
    

    
      
        if(idCampo.name === "correo"){
          const modal = await this._modalCtrl.create({
            component: IngresarPCComponent,
            componentProps: {
              uid: this._auth.usuario.uid,
              campo: idCampo.name
            }

          });
      
          await modal.present();

          const { data } = await modal.onWillDismiss()
          
          
          if(data.actualizado){
            
            this._auth.actualizarCorreo(idCampo.value);
            this._futbol.getUserByLocal(this._auth.usuario.uid)
            .subscribe(respData => {
              respData.docs.map(idDoc => {

                this._futbol.actualizarUser( idDoc.id, dataInfo)
                .then( () => {
                  alert.present();
                  setTimeout(() => {
                    this._modalCtrl.dismiss();
                  }, 700);
                  
                });
              })
            })
          }
          //this._auth.actualizarCorreo(idCampo.value);
        }else if(idCampo.name === "contrasenia"){
          const modal = await this._modalCtrl.create({
            component: IngresarPCComponent,
            componentProps: {uid: this._auth.usuario.uid}
          });
          
          await modal.present();
          const { data } = await modal.onWillDismiss()
          
          
          if(data.actualizado){
            this._auth.actualizarPass(idCampo.value);
          
            this._futbol.actualizarUser( this._auth.usuario.uid, dataInfo)
            .then( () => {
              alert.present();
              
              this._modalCtrl.dismiss();
            });
          }
        }else{
          const modal = await this._modalCtrl.create({
            component: IngresarPCComponent,
            componentProps: {uid: this._auth.usuario.uid}
          });
      
          await modal.present();

          const {data} = await modal.onDidDismiss()
          if(data.actualizado){
            this._futbol.getUserByLocal(this._auth.usuario.uid)
            .subscribe(resp => {
              resp.docs.map(idDoc => {

                this._futbol.actualizarUser( idDoc.id, dataInfo)
                .then( () => {
                  alert.present();
                  
                  this._modalCtrl.dismiss();
                });
              })
            })

          }
         
        }
      
    

    
    
  }

}
