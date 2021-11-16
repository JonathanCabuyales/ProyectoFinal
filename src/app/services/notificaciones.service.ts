import { Injectable } from '@angular/core';
import {LocalNotifications, ActionPerformed, LocalNotificationSchema} from '@capacitor/local-notifications';
import { PushNotifications, PushNotificationSchema, Token } from "@capacitor/push-notifications";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';
import { datosPersonales, Registro, RespUbicaciones } from '../interfaces/interfaces.futbol';
import { notificaciones } from '../interfaces/chat.interface';



@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  urlSend: string = "https://fcm.googleapis.com/fcm/send";
  token: string = "";
  idDocRegistro: string = "";
  eidReserva: string = "";
  notificacionesArr: any[] = [];
  androidId: string ="";
  constructor(
    private _http: HttpClient,
    private _toast: ToastController,
    private _navCtrl: NavController,
    private _afs: AngularFirestore
  ) { }
  
  //funcion para obtener las notificaciones
  obtenerNotificaciones(uuid: string, tipo: string){
    return this._afs.collection<notificaciones>('notificaciones', ref => ref.where('para', '==', uuid).where('tipo', '==', tipo)).valueChanges()
    .pipe(
      map( (noti) => {
        this.notificacionesArr = [];
        this.notificacionesArr.unshift(...noti);
      })
    );
  }

  obtenerNotificacionesPropietario(uuid: string, tipo: string){
    return this._afs.collection<notificaciones>('notificaciones', ref => ref.where('para', '==', uuid).where('tipo', '==', tipo)).get()
    .pipe(
      map( (noti) => {
        this.notificacionesArr = [];
        for(let r of noti.docs){
          this.notificacionesArr.unshift({data: r.data(), idReserva: r.id});
        }
      })
    );
  }
  //funcion para obtener el token
  obtenerTokenFirebase(uuid: string){
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid', '==', uuid)).get()
    .pipe(
      map(t => {
        for(let tk of t.docs){
          
          this.idDocRegistro = tk.id;
          this.androidId = tk.data().token.androidId;
          this.token = tk.data().token.token;
        }
      })
    )
  }

  //funcion para guardar el token
  guardarTokenFirebase(tk: string, idDoc: string, idAndroid: string){
    return this._afs.collection<Registro>('registroPerfil').doc(idDoc).update({
      token:{
        androidId: idAndroid,
        token: tk
      }
    });
  }

  //funcion de error de registro de token
  async errorRegistrarToken(){
    await PushNotifications.addListener('registrationError', async(e) => {
      await this._toast.create({
        duration:2500,
        message: `Error al registrar el Push ${e}`,
        buttons: ['omitir']
      })
      .then((resp) => {
        resp.present();
      })
      .catch(async (err) => {
        await this._toast.create({
          duration: 2500,
          message: `error ${err}`,
          buttons: ['omitir']
        });
      });
    });
  }

  //funcion para registrar token exitoso
  async registroExitoToken(idAndroid: string){
    await PushNotifications.addListener('registration', async (e: Token) => {
      if(e.value.length > 0){
        await this._toast.create({
          duration: 2500,
          message: `Se ha creado el token ${e.value}`,
          buttons: ['omitir']
        })
        .then(async (resp) => {
          /* resp.present(); */
          
          
          
        })
        .catch(async(err) => {
          await this._toast.create({
            duration: 2500,
            message: `err ${err}`
          });
        });
        await this.guardarTokenFirebase(e.value, this.idDocRegistro, idAndroid)
        .then(() => {
          
        })
        .catch((err) => {
          
        
        });
        
      }else{
        await this._toast.create({
          duration: 2500,
          message: `No se ha podido crear el token`,
          buttons: ['omitir']
        })
        .then((resp) => {
          resp.present();
        })
      }
    });
  }
  
  //funcion para notificaciones locales
  

  async notificacionPushRecibida(idDocUser?:string){
    await PushNotifications.addListener('pushNotificationReceived', (e: PushNotificationSchema) => {
      
      
      LocalNotifications.schedule({
        notifications: [{
          title: e.title,
          body: e.body,
          largeBody: e.body + '\n' + e.data.mensajes,
          id: Math.random(),
          extra: e
        }]
      })
      .then(async (r) =>{
        
      
        
        await this.guardarNotificaciones(e, e.data.paraId, e.data.tipo)
        .then(() => {
          
          
        })
        .catch((err) => {
          
          
        })
        
      })
      .catch((err) => {
        
        
      });
      
      
    });
  }


  //funcion para notificaciones locales 
  async notificacionesLocalesRecibida(){
    await LocalNotifications.addListener('localNotificationReceived', async (e) => {
      console.log('llega', e);
      
      
    });
  }
  async notificacionesLocales(){
    await LocalNotifications.addListener('localNotificationActionPerformed', async (e: ActionPerformed) => {
      console.log('llega',e);
      
      if(e.actionId === 'tap'){
        this._navCtrl.navigateForward(e.notification.extra.data.abrirNoti);
      }
    });
  }

  async registrarToken(){
    await PushNotifications.checkPermissions()
    .then(async (r) => {
      if(r.receive !== 'granted'){
        await PushNotifications.requestPermissions();
      }else{
        await PushNotifications.register();
      }
    })
    .catch(async (err) => {
      await this._toast.create({
        duration: 2500,
        message: `Error ${ err }`,
        buttons: ['omitir']
      }).then((resp) => {
        resp.present();
      });
    });
  }

  //funcion para guardar las notificaciones
  guardarNotificaciones(notificacion: PushNotificationSchema, idUser: string, tipo: string){
    
    return this._afs.collection('notificaciones').add({
      ...notificacion,
      fecha: new Date().getTime(),
      tipo: tipo,
      para: idUser
    });
  }

  async tokenExiste(idDocUser?:string){
    await PushNotifications.checkPermissions()
    .then(async (r) => {
      if(r.receive !== 'granted'){
        await PushNotifications.requestPermissions();
      }
    })
    .catch(async (err) => {
      await this._toast.create({
        duration: 2500,
        message: `Error ${ err }`,
        buttons: ['omitir']
      }).then((resp) => {
        resp.present();
      });
    });
    
  }

  enviarNotificacion(titulo: string, nombre:string, token:string, mensaje: string, paraId: string, tipo: string, actionNoti: string, idR:string){
    

    const headers = new HttpHeaders()
                      .set('Authorization', 'key=AAAAJ905S5g:APA91bEoHhm-rPzvuEvSGQolflNjTBwnDTbHM7zbOXGoT87AQqt99AzK75PhxqNKNHHTfELglV3uYdyZgkSi-Kp2nEBRRYgeCmWP-lUhYqM6zp7hzYl14ZRiI-plm3NiIPkM6XZIGXqX')
                      .set('Content-Type', 'application/json');

    let notificacion = {
      "notification": {
        "title": titulo,
        "body":"[De: "+nombre+ "]",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "sound": "default",
        "icon": "ic_launcher"
      }, 
      "data": {
        "mensajes": mensaje,
        "nombre": nombre,  
        "paraId": paraId,
        "tipo": tipo,
        "abrirNoti": actionNoti,
        "idReserva": idR
      },
      "to": token
    };
    
    return this._http.post(this.urlSend, (notificacion), {headers: headers});
  }

  //obtener uid del documento
  obtenerIdDoc(idDocUbicaciones: string){
    return this._afs.collection<RespUbicaciones>('ubicaciones').doc(idDocUbicaciones).get()
    .pipe(
      map(uid => {
        this.eidReserva = uid.data().eid;
      })
    );
  }

  generarId(){
    let d = new Date().getTime();
    
    
    let uuid = 'xxx'.replace(/[xy]/g, (c) => {
        var r = (d + Math.random() * 16 ) % 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  //funcion para obtener una notificacion en comun
  getNotificacinById(idNotificacion: string){
    return this._afs.collection<notificaciones>('notificaciones', ref => ref.where('id', '==', idNotificacion)).get();
  }
}
