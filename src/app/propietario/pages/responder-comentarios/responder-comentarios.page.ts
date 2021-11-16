import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { ComentariosService } from '../../../services/comentarios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { comentariosInterface } from '../../../interfaces/comentarios.interface';

@Component({
  selector: 'app-responder-comentarios',
  templateUrl: './responder-comentarios.page.html',
  styleUrls: ['./responder-comentarios.page.scss'],
})
export class ResponderComentariosPage implements OnInit {

  @Input() comentario: comentariosInterface;
  respuestaComent: FormGroup;
  mensaje: string = "";
  mesajeBool: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
    private _coment: ComentariosService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController
  ) {
    this.crearFormulario();
   }

  ngOnInit() {

  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  get error(){
    return this.respuestaComent.get('comentario').invalid && (this.respuestaComent.get('comentario').touched || this.respuestaComent.get('comentario').dirty);
  }

  async guardar(comenResp: FormGroup){
    const toast = await this._toastCtrl.create({
      header:'Guardando...',
      message: 'El comentario se ha guardado correctamente',
      duration: 2500,
      buttons: ['aceptar'],
      position: 'middle'
    });

    
    
    /* if(this.respuestaComent.invalid){
      Object.values(this.respuestaComent.controls).forEach(a =>{
        a.markAllAsTouched();
      });
      return;
    } */
    if(comenResp.value.comentario.length === 0){
      this.mensaje = "El campo no puede estar vacio";
      this.mesajeBool = true;
    }else{
      this.mensaje = "";
      this.mesajeBool = false;
      let idComent = this.generarId();
      this._coment.getIdDocComentario(this.comentario.dataInfo.uidLocal, this.comentario.dataInfo.uidUser)
      .subscribe(() =>{
        
        this._coment.agregarRespuestaComentario(this._coment.idDocComentarios, idComent, comenResp.value.comentario, this.comentario)
        .then(() =>{
          
          toast.present();
          setTimeout(() => {
            this._modalCtrl.dismiss();
          }, 500);
        })
        .catch((err) =>{
          
          
        })
      }, (err) =>{

      })
    }
  }

  async cancelar(){
    const alert = await this._alertCtrl.create({
      backdropDismiss: false,
      message: '¿Desea descartar los cambios?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger'
        },
        {
          text: 'Aceptar',
          role: 'aceptar',
          cssClass: 'primary',
          handler : () =>{
            this.resetearFormulario();
            this._modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  crearFormulario(){
    this.respuestaComent = this._fb.group({
      comentario: ['']
    });
  }

  resetearFormulario(){
    this.respuestaComent.reset(
      {comentario: ['']}
    );
  }

  generarId(){
    let d = new Date().getTime();
    
    
    let uuid = 'xxxxxyfxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (d + Math.random() * 16 ) % 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
