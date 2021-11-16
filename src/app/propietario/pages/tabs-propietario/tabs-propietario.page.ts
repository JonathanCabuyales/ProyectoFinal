import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GenericoService } from '../../../services/generico.service';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AuthService } from '../../../services/auth.service';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Device } from "@capacitor/device";
import { AlmacenamientoService } from '../../../services/almacenamiento.service';

@Component({
  selector: 'app-tabs-propietario',
  templateUrl: './tabs-propietario.page.html',
  styleUrls: ['./tabs-propietario.page.scss'],
})
export class TabsPropietarioPage implements OnInit, AfterViewInit, AfterContentInit {

  tabsP: any = [];

  constructor(
    private _tabs: GenericoService,
    private _menu: MenuController,
    private _futbolInn: FutbolInnService,
    private _auth: AuthService,
    private _propService: PropietarioSService,
    private _noti: NotificacionesService,
    private _storage: AlmacenamientoService
  ) { 
    this.abrirMenu();
  }

  ngOnInit() {
    this.getTabs();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this._futbolInn.getUserByIdDocPerfil(this._auth.usuario.uid)
      .subscribe(() =>{})
    }, 700);
  }
  ngAfterContentInit(){
    this.getIdDoc();
    this._storage.getData('firebase')
    .then((r) =>{
      if(r){
        let fb = JSON.parse(r);
        this._noti.obtenerTokenFirebase(fb.user.uid)
        .subscribe(async () => {
          
          
          
          await Device.getId()
          .then(async (idDevice)=>{

            if(this._noti.token.length === 0 && this._noti.androidId.length === 0){
              
              
              await this._noti.registrarToken();
              await this._noti.errorRegistrarToken();
              await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              
            }else if(this._noti.token.length > 0 && this._noti.androidId !== idDevice.uuid){
              
              await this._noti.registrarToken();
              await this._noti.errorRegistrarToken();
              await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              
              
            }else if(this._noti.token.length > 0 && this._noti.androidId === idDevice.uuid){
              /* await this._noti.registrarToken();
              await this._noti.errorRegistrarToken(); */
              //await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              

            }
          })
          .catch((err)=>{

          });
        });
      }else{
        this._noti.obtenerTokenFirebase(this._auth.usuario.uid)
        .subscribe(async () => {
          
          
          
          await Device.getId()
          .then(async (idDevice)=>{

            if(this._noti.token.length === 0 && this._noti.androidId.length === 0){
              
              
              await this._noti.registrarToken();
              await this._noti.errorRegistrarToken();
              await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              
            }else if(this._noti.token.length > 0 && this._noti.androidId !== idDevice.uuid){
              
              await this._noti.registrarToken();
              await this._noti.errorRegistrarToken();
              await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              
              
            }else if(this._noti.token.length > 0 && this._noti.androidId === idDevice.uuid){
              /* await this._noti.registrarToken();
              await this._noti.errorRegistrarToken(); */
              //await this._noti.registroExitoToken(idDevice.uuid);
              await this._noti.notificacionPushRecibida();
              await this._noti.notificacionesLocales();
              

            }
          })
          .catch((err)=>{

          });
        });
      }
    })
  }

  getIdDoc(){
    
    this._propService.getEstablecimiento(this._auth.usuario.uid)
    .subscribe();
  }

//funcion para obtener las tabs del propietario
  getTabs(){
    this._tabs.getTabsPropietario()
    .subscribe( resp => {
      
      this.tabsP = resp;
      
    });
  }

  //funcion para abrir un menu en especifico
  abrirMenu(){
    this._menu.enable(true, 'propietario');
  }

}
