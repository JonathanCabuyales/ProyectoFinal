import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { NavController, ModalController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { ChatDirectoPage } from '../chat-directo/chat-directo.page';
import { FutbolInnService } from '../../../services/futbol-inn.service';


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit, AfterViewInit, OnDestroy {

  abrirSearch: boolean = false;
  chats: any[]= [];
  chatsAll:any[] = [];
  ultimos: any[] = [];
  informacionData: any[] = [];
  fotos: any = [];
  buscarTexto: string = ""
  constructor(
    public _chats: ChatService,
    private _futbolService: FutbolInnService,
    private _auth: AuthService,
    private _modalCtrl: ModalController
  ) { }

  ngOnInit() {

    
  }
  ionViewDidEnter(){
    this.getUltimoMensaje();
  }
  ngAfterViewInit(){
    /* this.cargarFotoLocal(); */
  }

  abrirbuscar(){
    this.abrirSearch = !this.abrirSearch;
    this.buscarTexto = "";
  }

  onSearchChange( evento: any){
    
    if(evento.target.value.trim().length === 0){
      this.getUltimoMensaje();
    }else{
      this.chats = this.chats.filter(a =>{
        return a.mensajes.nombreTo.toLowerCase().includes(evento.target.value.toLowerCase());
      });
    }
    
    
  }

  getUltimoMensaje(){
    
    this._auth.currentUserFirebase()
    .then((r) =>{
      this._chats.getChatsByUser(r.uid)
      .subscribe( (respChat) => {
        for(let mensaje of respChat.docs){
          
          this.chats = [];
          this._futbolService.getSearchEstablecimiento( mensaje.data().to )
          .subscribe( data => {
            if(mensaje.data().to === data.id){
              
              
              this.chats.push({mensajes: mensaje.data(), fotos: data.data().foto});
            }
            
          });
          
        }
      }, (errno) => {
        
      })
    })
    .catch((err) =>{

    });
      
  }

  

  async chatDirect( idDocLocal:string, idDocUser: string ){
    
    /* this._storage.set('idDocLocal', idDocLocal); */
    const modal = await this._modalCtrl.create({
      component: ChatDirectoPage,
      componentProps:{
        idDocLocal: idDocLocal,
        idDocUser: idDocUser
      }
    });

    await modal.present();


    await modal.onWillDismiss()
    .then(() =>{
      this.chats = [];
      this.getUltimoMensaje();
    })
    .catch((er) =>{

    })
    /* this._navCtrl.navigateForward(`/chat-directo/${ idDocLocal }/${idDocUser}`); */
  }

  cargarFotoLocal(){
    this._chats.getChatsByUserFoto(this._auth.usuario.uid)
    .subscribe( (respChat) => {
      for(let mensaje of respChat){
        this._futbolService.searchEstablecimiento( mensaje.to )
        .subscribe( data => {
          this.informacionData = [];
          this.informacionData.push(data)
        });
        
      }
    }, (errno) => {
      
    })
  }
  limpiarTexto(){
    this.buscarTexto = "";
  }
  cancelado(){
    this.buscarTexto = "";
    this.getUltimoMensaje();
    
  }

  ngOnDestroy(){
    
  }

}
