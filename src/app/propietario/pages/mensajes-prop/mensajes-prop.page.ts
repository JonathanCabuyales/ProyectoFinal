import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { NavController, MenuController } from '@ionic/angular';
import { FutbolInnService } from '../../../services/futbol-inn.service';

@Component({
  selector: 'app-mensajes-prop',
  templateUrl: './mensajes-prop.page.html',
  styleUrls: ['./mensajes-prop.page.scss'],
})
export class MensajesPropPage implements OnInit, AfterViewInit {
  idDocLocal: string = '';
  ultimoMensaje: any[] = [];
  foto:string = "";
  abrirSearch: boolean = false;
  nombreLocalSearch: string ="";
  public chats: any[] = [];

  constructor(
    private _propService: PropietarioSService,
    public _chats: ChatService,
    private _auth: AuthService,
    private _navCtrl: NavController,
    private _futbolInn: FutbolInnService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    
  }
  ionViewDidEnter(){
    this.getMensajes();
  }
  /* ionViewWillEnter(): void {
    this.menu.enable(false);
  }
  /* ionViewWillEnter(): void {
    this.menu.enable(false);
  }
  
  ionViewWillLeave(): void {
    this.menu.enable(true);
  } */


  getMensajes(){

    this._propService.getIdDocOfUbicaciones(this._auth.usuario.uid)
    .subscribe(() => {
      this._chats.getChatOfLocal(this._propService.idDocReserva)
      .subscribe((respChat) => {
        for(let chat of respChat.docs){
          this.chats = [];
          
          this._futbolInn.getUserByLocal(chat.data().from)
          .subscribe((resp) =>{
            for(let f of resp.docs){
              this.chats.push({chat: chat.data(), fotos: f.data().foto});
              /* console.log(this.chats); */
              
              
            }
          }, (err) =>{

          });
          
        }
      })
    });

  }

  cargarImagen(from: string){
    this._futbolInn.getUserByLocalDoc(from)
    .subscribe((r) =>{
      for(let f of r){

        for(let a of f.foto){
          this.foto = a.url;
        }
      }
    }, (err) =>{

    })
  }
  onSearchChange(evento: any){
    
    
    let buscar: string = evento.target?.value;
    if(buscar.trim().length === 0){
      this.getMensajes();
    }else{

      this.chats = this.chats.filter(a => {
        return a.chat.nombreFrom.toLowerCase().includes(buscar.trim().toLowerCase());
      });
    }

    
    
  }

  search(){
    this.abrirSearch = !this.abrirSearch;
  }
  cancelado(){
    this.nombreLocalSearch = "";
  }
  limpiar(){
    this.getMensajes();
    
  }/* 
  limpiarTexto(){
    this.nombreLocalSearch = "";
    this.getMensajes();
    
  } */
  
  abrirMenu(){
    this.menu.enable(true, 'propietario');
    this.menu.open('propietario');
    /* this._propService.getEstablecimiento(this._auth.usuario.uid)
        .subscribe(); */
  }

  

  verMensaje( usuario: any ){
    
    this._navCtrl.navigateForward(`/mensajes-resp/${usuario.to}/${usuario.from}`)
    
  }

}
