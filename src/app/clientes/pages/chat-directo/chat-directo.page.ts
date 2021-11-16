import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat-directo',
  templateUrl: './chat-directo.page.html',
  styleUrls: ['./chat-directo.page.scss'],
})
export class ChatDirectoPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('inputMsj') enviarMensaje: ElementRef;
  @Input() idDocLocal: string;
  @Input() idDocUser: string;
  mensajes: any[] = [];
  dataLogin: any = {};
  nombreLocal: string = "";
  elemento:any;
  formMensaje: FormGroup;
  nombreUser: string = "";
  fotos: any = [];
  constructor(
    private _fb: FormBuilder,
    public _chat: ChatService,
    private _futbol: FutbolInnService,
    public _auth: AuthService,
    private _noti: NotificacionesService,
    private _modalCtrl: ModalController
  ) {
    this.crearFormulario();
   }

  ngOnInit() {
    
    this.elemento = document.getElementById('app-msj');
  }
  
  ngAfterViewInit(){
    this.getNombreLocal(this.idDocLocal);
    this.getMensajes();
    this.nombreDelUsuario();
    
  }

  //funcion para crear el formulario del chat
  crearFormulario(){
    this.formMensaje = this._fb.group({
      mensaje: ['']
    });
  }

  //funcion para obtener el nombre del local para el chat
  getNombreLocal(idDocLocal: string){
    this._futbol.searchEstablecimiento(idDocLocal)
    .subscribe( (respLocal) => {
      this.nombreLocal = respLocal.nomLocal;
      this.fotos = respLocal.foto;
    }, (errno) => {
      
      
    });
  }


  //funcion para agregar el chat a la base de datos;
  addChat(formulario: FormGroup){
    
    let mensaje = formulario.value.mensaje;
    //this.mensajes.push(formulario.value.mensaje);
    
    
    this._chat.getIdOfDocumentMensaje(this.idDocLocal, this._auth.usuario.uid)
    .subscribe( respData => {
      
      if(respData.empty){
        
        this._chat.addChats(this._auth.usuario.uid, this.idDocLocal, mensaje, this.nombreLocal, this.nombreUser)
        .then( (res) => {
          //obtengo el token del eid del local
          this._noti.obtenerTokenFirebase(res.id)
          .subscribe(() => {
            this._noti.enviarNotificacion('Nuevo Mensaje', this.nombreUser, this._noti.token, mensaje, this.idDocLocal, "mensajes", "tabs-propietario/mensajes-prop", '')
            .subscribe(async () => {
              
            }, (err) => {
              
            })
          }, (err) => {

          });
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }).catch((errno) =>{});
      }else{

        for(let doc of respData.docs){
          this._chat.actualizarMensajes(doc.id, this._auth.usuario.uid, mensaje)
          .then(() => {
              //obtengo en eid del local
              this._noti.obtenerIdDoc(doc.data().to)
              .subscribe(() => {
                //obtengo el token del eid del local
                this._noti.obtenerTokenFirebase(this._noti.eidReserva)
                .subscribe(() => {
                  this._noti.enviarNotificacion('Nuevo Mensaje', this.nombreUser, this._noti.token, mensaje, this.idDocLocal, "mensajes", "tabs-propietario/mensajes-prop", '')
                  .subscribe(async () => {
                    
                  }, (err) => {
                    
                  })
                }, (err) => {

                });
              }, (err) => {});
              this.elemento.scrollTop = this.elemento.scrollHeight;
            }).catch((errno)=> {})
            
          }
      }
      
    }, (errno) => {});
      
    this.resetFormulario();
        
  }

  //funcion para obtener todos los mensajes
  getMensajes(){
    
    try {
      this._chat.getAllMensajes(this.idDocLocal, this.idDocUser)
      .subscribe( () => {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20);
      }, (errno) => {});
    } catch (error) {
      
    }
      
  }

  nombreDelUsuario(){
    this._futbol.getUserByLocalDoc(this._auth.usuario.uid)
    .subscribe((nomUser) => {
      nomUser.map(a => {
        this.nombreUser = a.nombre;
      });
      
    });
  }

  //funcion para obtener el id del Documento
  getDocMensajes(idDocLocal:string, uidAuth: string){
    
        this._chat.getIdOfDocumentMensaje(idDocLocal, uidAuth)
        .subscribe( respData => {
          for(let doc of respData.docs){
            
            return doc.id;
          }
          
        });
      
  }

  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  //funcion para resetear el formulario
  resetFormulario(){
    this.formMensaje.reset({
      mensaje: ''
    });

    
    
  }






  ngOnDestroy(){
    this.nombreLocal = "";
  }
  

}
