import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { IonInput } from '@ionic/angular';
import * as moment from 'moment';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-mensajes-resp',
  templateUrl: './mensajes-resp.page.html',
  styleUrls: ['./mensajes-resp.page.scss'],
})
export class MensajesRespPage implements OnInit, AfterViewInit {
  @ViewChild('inputMsj') enviarMensaje: IonInput;
  idDocUser: string = "";
  idDocLocal: string = "";
  dataLogin: any = {};
  elemento: any;
  formMensaje: FormGroup;
  nombreUser: any = "";
  fotos: any = [];
  constructor(
    public _chat: ChatService,
    private _actiaved: ActivatedRoute,
    private _fb: FormBuilder,
    private _futbol: FutbolInnService,
    private _noti: NotificacionesService,
    private _auth: AuthService
  ) {
    this.idDocUser = this._actiaved.snapshot.paramMap.get('idUser');
    this.idDocLocal = this._actiaved.snapshot.paramMap.get('idLocal');
    
    
    this.crearFormulario();
  }
  
  ngOnInit() {
    
    this.elemento = document.getElementById('app-msj');
    this.getNombreUser();
  }
  
  
  ngAfterViewInit(){
    this.getMensajesAll();
  }

  crearFormulario(){
    this.formMensaje = this._fb.group({
      mensaje: ['']
    });
  }

  getMensajesAll(){
    
    
    this._chat.getAllMensajes(this.idDocLocal, this.idDocUser)
    .subscribe(()=>{
      
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
    })
  }

    //funcion para resetear el formulario
    resetFormulario(){
      this.formMensaje.reset({
        mensaje: ''
      });
  
      
    }

  addChat(formulario: FormGroup){
    
    let mensajeForm = formulario.value.mensaje;
    this.resetFormulario();
    this._chat.getIdOfDocumentMensaje(this.idDocLocal, this.idDocUser)
    .subscribe((respId) => {
      
      
      if(!respId.empty){
        for(let idDoc of respId.docs){
          this._chat.actualizarMensajes(idDoc.id, this.idDocLocal, mensajeForm)
          .then(async () =>{
            
            await this._noti.obtenerTokenFirebase(idDoc.data().from)
            .subscribe(async () => {

              await  this._noti.enviarNotificacion('Nuevo Mensajes', idDoc.data().nombreTo, this._noti.token, mensajeForm,  this.idDocUser, 'mensajes', "tabs-cliente/mensajes", '')
              .subscribe(async () => {
                
                this.elemento.scrollTop = this.elemento.scrollHeight;
              }, (err) => {
                
                
              })
            }, (err) => {

            });
          }).catch((errno) => {})
          
        }
      }else{
        this._futbol.getSearchEstablecimiento(this.idDocLocal)
        .subscribe((respLocal) => {
          
          let nombreFrom = respLocal.data().nomLocal;
          this._futbol.getUserByLocalDoc(this.idDocUser)
          .subscribe( (dataUser) => {
            let nombreTo = dataUser.map(a => a.nombre);
            this._chat.addChats(this.idDocLocal, this.idDocUser, mensajeForm, nombreTo[0], nombreFrom)
            .then(async () => {
              
              let token = dataUser.map(a => a.uid);
              
              await  this._noti.enviarNotificacion('Nuevo Mensajes', nombreTo[0], token[0], mensajeForm, this.idDocUser, "Mensajes", "tabs-cliente/mensajes", '' )
              .subscribe(() => {
                
                this.elemento.scrolltop = this.elemento.scrollHeight;
              }, (err) => {
                
                
              })
            });
          });
              
        });
        
      }
    });

  }

  getNombreUser(){
    this._futbol.getUserByLocalDoc(this.idDocUser)
    .subscribe((respNombre) => {

      this.nombreUser = respNombre.map(a => a.nombre);
      this.fotos = respNombre.map(a => a.foto);
    });
  }

  

}
