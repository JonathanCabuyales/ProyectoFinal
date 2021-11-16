import { AfterViewInit, Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { GenericoService } from '../../../services/generico.service';
import { TabsGenerico } from '../../../interfaces/interfaces.futbol';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { MenuController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AuthService } from '../../../services/auth.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Device } from "@capacitor/device";
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-tabs-cliente',
  templateUrl: './tabs-cliente.page.html',
  styleUrls: ['./tabs-cliente.page.scss'],
})
export class TabsClientePage implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  
  tabsPrincipal: TabsGenerico[];
  constructor(
    private _serviceGenerico: GenericoService,
    private _storage: AlmacenamientoService,
    private _menu: MenuController,
    private _futbolInn: FutbolInnService,
    private _auth: AuthService,
    private _noti: NotificacionesService
  ) {

    this.abrirMenu();
   }

  ngOnInit() {
    
  }
  //funcion para abrir un menu en especifico
  abrirMenu(){
    this._menu.enable(true, 'cliente');
  }

  ngAfterViewInit(){
    this.getTabs();
    
  }
  ionViewDidEnter(){
    this.lanzarNotificacionLocal();
  }

  async ngAfterContentInit(){
    try {
      this._noti.obtenerTokenFirebase(this._auth.usuario.uid)
          .subscribe(async () => {
            await Device.getId()
            .then(async (idDevice)=>{

              if(this._noti.token.length === 0 && this._noti.androidId.length === 0){
                
                
                await this._noti.registrarToken();
                await this._noti.errorRegistrarToken();
                await this._noti.registroExitoToken(idDevice.uuid);
                await this._noti.notificacionPushRecibida();
                await this._noti.notificacionesLocalesRecibida();
                await this._noti.notificacionesLocales();
                
              }else if(this._noti.token.length > 0 && this._noti.androidId !== idDevice.uuid){
                await this._noti.registrarToken();
                await this._noti.errorRegistrarToken()
                await this._noti.registroExitoToken(idDevice.uuid);
                await this._noti.notificacionPushRecibida();
                await this._noti.notificacionesLocalesRecibida();
                await this._noti.notificacionesLocales();
                
                
                
              }else if(this._noti.token.length > 0 && this._noti.androidId === idDevice.uuid){
                /* await this._noti.registrarToken();
                await this._noti.errorRegistrarToken(); */
                //await this._noti.registroExitoToken(idDevice.uuid);
                await this._noti.notificacionPushRecibida();
                await this._noti.notificacionesLocalesRecibida();
                await this._noti.notificacionesLocales();
                

              }
            })
            .catch((err)=>{

            });
            
            
          })
      
    } catch (error) {
      
    }
  }

  //funcion para presentas los tabs de la principal
  getTabs(){
    this._serviceGenerico.getTabsPrincipales()
    .subscribe( tabs => {
      this.tabsPrincipal = tabs;
    }, (errno) => {
      
      
    });
  }

  cambio(evento: any){
    
    
  }

  //funcion para lanzar notificacion local de reserva
  lanzarNotificacionLocal(){
    let fechaUser = new Date();
    this._futbolInn.getReservasByUserLocalNoti(this._auth.usuario.uid)
    .subscribe((resp) => {
      console.log('tabs-cliente', resp);
      
        for(let r of resp.docs){
          console.log('documentos ', r.data());
          
          for(let recordatorio of r.data().dataReserva){
            if(recordatorio.fechaTiempoReserva > fechaUser.getTime()){
              
              console.log('recordatorio mayor', recordatorio);
              let fechaParse = new Date(recordatorio.fechaTiempoReserva);
              console.log(fechaUser.getHours());
              console.log(fechaParse);
              if(fechaUser.getDate() === fechaParse.getDate()-1){
                let horaDiferencia = (fechaUser.getHours() - fechaParse.getHours() );
                horaDiferencia = horaDiferencia < 0 ? horaDiferencia * (-1): horaDiferencia;
                console.log(horaDiferencia);
                if(horaDiferencia <= 12){
                  LocalNotifications.schedule(
                    {
                      notifications: [{
                        title: 'Recordatorio',
                        body: 'Reserva' + (fechaUser.getTime() !== recordatorio.fechaTiempoReserva) ? `Usted tiene una reserva para el día ${recordatorio.fechaReserva} a las ${ recordatorio.horaInicio } en ${ r.data().local.nomLocal }`: `Espero este disfrutando del partido de futbol que ha reservado, para las ${ recordatorio.horaInicio }`,
                        id: (Math.random()*100),
                        schedule: {
                         allowWhileIdle: true,
                         at: (fechaUser.getTime() !== recordatorio.fechaTiempoReserva) ? new Date(fechaParse.getTime() - 54000000): new Date(Number.parseInt(recordatorio.fechaReserva.slice(0,4)), (Number.parseInt(recordatorio.fechaReserva.slice(5,7)) - 1), (Number.parseInt(recordatorio.diaFecha)), Number.parseInt(recordatorio.horaInicio.slice(0,2)), 0, 0),
                         count: 1,
                         every: 'hour'
                        }
                      }]
                    }
                  );
                }
              }else{
                console.log('no es hoy', new Date(fechaParse.getTime() - 54000000));
                
              }
              
            }
          }
        }
        
        /* for(let r of resp.docs){
          
          
          for(let a of r.data().dataReserva){
            
            let fechaParse = Number.parseInt(a.horaInicio.slice(0,2));
            if(fechaUser.getDate().toString() === a.diaFecha){
              
              
               
            }
          }
          
        } */
    }, (err) => {

    })
  }

  ngOnDestroy(){
    this._storage.limpiarKey('idDocLocal');
    this._storage.limpiarKey('idDocMensajes');
  }

}
