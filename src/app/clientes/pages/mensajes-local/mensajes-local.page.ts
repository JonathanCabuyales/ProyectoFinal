import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ChatService } from '../../../services/chat.service';
import { combineLatest } from 'rxjs';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { ChatDirectoPage } from '../chat-directo/chat-directo.page';

@Component({
  selector: 'app-mensajes-local',
  templateUrl: './mensajes-local.page.html',
  styleUrls: ['./mensajes-local.page.scss'],
})
export class MensajesLocalPage implements OnInit, AfterViewInit {
  abrirSearch = false;
  fotos: any = [];
  chats: any[] = [];
  uid: string = "";
  constructor(
    public _chats: ChatService,
    private _storage: AlmacenamientoService,
    private _futbol: FutbolInnService,
    public _auth: AuthService,
    private _modalCtrl: ModalController
  ) { }

  ngOnInit() {
    
    
    
  }
  ionViewDidEnter(){
    this.cargarUid();
  }
  ngAfterViewInit(){
    this.ultimoMensaje();
    this.cargarfoto();
  }

  ultimoMensaje(){
    this._auth.cargarUsuario()
    .then((resp) =>{
      combineLatest([
        resp,
        this._storage.getData('idDocLocal')
      ])
      .subscribe(([auth, idDocLocal]) =>{
        if(auth){
          this.chats = [];
          this._chats.getAllMensajesLocal(idDocLocal, auth.uid)
          .subscribe((resp) =>{
            for(let c of resp){
              this.chats.push(c);
            }
            
            
            
          });
        }
      })
      /* resp.subscribe((r) =>{
        this._chats.getAllMensajes()

      }); */
    })
    .catch((err) =>{

    })
  }


  cargarfoto(){
    this._futbol.getUserByLocalDoc(this._auth.usuario.uid)
    .subscribe((f) =>{
      for(let img of f){
        this.fotos = img.foto;
      }
    }, (err) =>{

    })
  }

  cargarUid(){
    this._auth.currentUserFirebase()
    .then((r) =>{
      this.uid = r.uid;
    })
    .catch((err) =>{

    });
  }


  async abrirMensaje( idDocLocal:string, idDocUser: string ){
    
    
    
    const modal = await this._modalCtrl.create({
      component: ChatDirectoPage,
      componentProps:{
        idDocLocal: idDocLocal,
        idDocUser: idDocUser
      }
    });
    await modal.present();
    modal.onWillDismiss()
    .then(() =>{
      this.ultimoMensaje();
      this.cargarfoto();
    })
    .catch((err) =>{

    })

    /* this._navCtrl.navigateForward(`/chat-directo/${ idDocLocal }/${idDocUser}`); */
  }
  

  abrirbuscar(){
    this.abrirSearch = !this.abrirSearch;
  }
  onSearchChange( evento: any ){

  }

  
  nuevoMensaje(){
    combineLatest([
      this._storage.getData('idDocLocal'),
      this._auth.currentUserFirebase()
    ]).subscribe(async ([idDocLocal, uid]) => {
      const modal = await this._modalCtrl.create({
        component: ChatDirectoPage,
        componentProps:{
          idDocLocal: idDocLocal,
          idDocUser: uid.uid
        }
      });
  
      await modal.present();
  
  
      await modal.onWillDismiss()
      .then(() =>{
        this.chats = [];
        this.ultimoMensaje();
      })
      .catch((er) =>{
  
      })
      
    });
  }

}
