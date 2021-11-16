import { Component, AfterViewInit, OnInit, AfterContentInit } from '@angular/core';
import { GenericoService } from './services/generico.service';
import { FutbolInnService } from './services/futbol-inn.service';
import { AuthService } from './services/auth.service';
import { Platform, ToastController, AlertController, NavController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { PropietarioSService } from './services/propietario-s.service';
import { Network } from '@capacitor/network';
import { App } from "@capacitor/app";
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit {

  menuClientes: any = [];
  menuPropietario: any = [];
  tipo:string = '';
  cont = 0;
  intervalo: number = 0;
  datosPersonales: any = [];
  constructor(
    private _generico: GenericoService,
    public _futbol: FutbolInnService,
    public _auth: AuthService,
    private _platform: Platform,
    public _prop: PropietarioSService,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
  ) {
    this._platform.backButton.subscribeWithPriority(-1, async () =>{
        const alert = await this._alertCtrl.create({
          message: 'Está seguro que desea salir?',
          backdropDismiss: false,
          translucent: true,
          header: 'Salir',
          buttons:[
            {
              text: 'Aceptar',
              role: 'acept',
              handler: () =>{
                App.exitApp();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]
        });

        await alert.present();

      
    });
    
    this._platform.backButton.subscribeWithPriority(1, async () =>{
      const toast = await this._toastCtrl.create({
        header: 'Salir',
        message: 'Presione de nuevo el botón atras para salir.',
        duration: 2000,
        buttons: ['omitir'],
        position: 'bottom',
        translucent: true
      });

      await toast.present();
    });
    this._platform.backButton.subscribeWithPriority(2, async () =>{
      const alert = await this._alertCtrl.create({
        message: 'Está seguro que desea salir?',
        backdropDismiss: false,
        translucent: true,
        header: 'Salir',
        buttons:[
          {
            text: 'Aceptar',
            role: 'acept',
            handler: () =>{
              App.exitApp();
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });

      await alert.present();
    });
    
    
  }

  async ngOnInit(){
    await this._platform.ready();
    //this.getDatosPersonales();
    Network.addListener('networkStatusChange', async (s) => {
      switch (s.connectionType) {
        case 'none':
          const toastnone = await this._toastCtrl.create({
            header: 'No tiene conexión wifi',
            message: 'Active el wifi o los datos para utilizar la aplicación',
            position: 'middle',
            translucent: true,
            duration: 3500,
            buttons: ['Aceptar']
          });

          toastnone.present();  
          break;
          case 'cellular':
            const toast = await this._toastCtrl.create({
              header: 'Recordatorio, tienes conexión',
              message: 'Esta utilizando datos móviles, para mejorar la conexión se le recomienda usar wifi',
              position: 'middle',
              translucent: true,
              duration: 4000,
              buttons: ['Aceptar']
            });
            toast.present();
            break;

            case 'unknown':
              const toastdef = await this._toastCtrl.create({
                header: 'No tiene conexión wifi',
                message: 'Active el wifi o los datos para utilizar la aplicación',
                position: 'middle',
                translucent: true,
                duration: 3500,
                buttons: ['Aceptar']
              });
      
              toastdef.present();
              break;
      
        default:
          const rees = await this._toastCtrl.create({
            message: 'Se Reestauro la conexión',
            position: 'bottom',
            translucent: true,
            duration: 1000,
            buttons: ['Aceptar']
          });
  
          rees.present();
          break;
      }
    });
  }
  
  async ngAfterViewInit(){
    combineLatest([
      this._generico.getMenuCliente(),
      this._generico.getMenuPropietario()
    ])
    .subscribe(([menuUser, menuProp]) => {
      
          this.menuClientes = [];
          this.menuPropietario = [];
          this.menuClientes = menuUser;
          this.menuPropietario = menuProp;
        
          /* 
          
          this.getDatosPersonales(); */
    });

    App.addListener('appRestoredResult', (e) =>{
      console.log('restored ', e);
      
      
    });
    App.addListener('appStateChange', (e) =>{
      
      if(e.isActive){
        firebase.auth().onAuthStateChanged((user) =>{
          if(!user?.uid){
            this._navCtrl.navigateBack('/login');
          }
        })
      }

    });

    

    /* document.addEventListener('ionBackButton', (e:BackButtonEvent) =>{
      
      e.detail.register(1, async () =>{
        const toast = await this._toastCtrl.create({
          message: 'Presione de nuevo el botón atras para salir',
          duration: 3000,
          position: 'bottom',
          translucent: true,
          header: 'Salir'
        });
        await toast.present();
      });

      e.detail.register(2, async () =>{
        const alert = await this._alertCtrl.create({
          backdropDismiss: false,
          header: 'Salir de la aplicación',
          message: 'Está seguro de salir de la aplicación',
          translucent: true,
          buttons: [
            {
              text: 'Aceptar',
              role: 'aceptar',
              handler: () =>{
                App.exitApp();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel',
            }
          ]
  
        });
        
        await alert.present();
      })
      
    }); */

    
  }
 
  async ngAfterContentInit(){
    this._auth.cargarUsuario()
    .then((resp) =>{
      resp.subscribe((r) =>{
        if(r){

          this._futbol.getUserByLocalDoc(r.uid)
          .subscribe((user) =>{
            
            this.datosPersonales = [];
            this.datosPersonales = (user);
          }, (err) =>{

          })
        }
      });
    })
    .catch((err) =>{

    });
    
    
  }

  cerrarSesion(){
    this._auth.logout();
  }

}
