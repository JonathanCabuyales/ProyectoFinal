import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { AuthService } from '../../../services/auth.service';
import { AlertController, MenuController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ReservaData } from '../../../interfaces/interfaces.futbol';
import { InformacionClientePage } from '../informacion-cliente/informacion-cliente.page';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Reservas } from 'src/app/interfaces/interfaces.futbol';

export interface reservar{
  data: any;
  nombreUser: string;
  id: string;
  extra: Reservas
}


@Component({
  selector: 'app-pricipal-reservas',
  templateUrl: './pricipal-reservas.page.html',
  styleUrls: ['./pricipal-reservas.page.scss'],
})
export class PricipalReservasPage implements OnInit, OnDestroy {

  idUbicaciones: string = "";
  fechaMin:any;
  fechaBuscar: string ='';
  dayCortos = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  customPickerOptions:any;
  customActionSheetOptions: any = {
    header: 'Seleccione un establecimiento'
  }
  reservasLocal: reservar[] = [];
  reservasLocalAuxiliar: any[] = [];
  constructor(
    public _propService: PropietarioSService,
    private _auth: AuthService,
    private _alertCtrl: AlertController,
    private _menu: MenuController,
    private _modalCtrl: ModalController,
    private _futbol: FutbolInnService,
    private _angularFire: AngularFireAuth,
    private _loadingCtrl: LoadingController,
    private _noti: NotificacionesService,
    private _toastCtrl: ToastController
  ) {
    this.reservasLocal = [];
    this.customPickerOptions = {
      buttons: [{
        text: 'Quitar Fecha',
        handler: (evento) => {
          this.fechaBuscar = "";
          /* this.getIdDoc(); */
        }
      }, {
        text: 'Aceptar',
        handler: (evento) => {
          
          
          this.fechaBuscar = `${ evento.year.text}-${ evento.month.text }-${ evento.day.text }`;
        }
      }, {
        text: 'Cancelar',
        handler: (evento) => {
          
        }
      }

    ]
    }
   }

  ngOnInit() {
  }
  async ionViewDidEnter() {
    const loading = await this._loadingCtrl.create({
      spinner: 'crescent',
      message: 'Espere por favor, estamos cargando la data',
      showBackdrop: true,
      translucent: true,
      animated: true,
      backdropDismiss: false,      
    });
    await loading.present();
    await this.cambiarActivoNoActivo();
    setTimeout(() => {
      this.getIdDoc();
      loading.dismiss();
    }, 400);
  }
  
  
  ionViewWillLeave(): void {
    this.reservasLocal = [];
  }



  abrirMenuProp(){
    this._menu.enable(true, 'propietario');
    this._menu.open('propietario');
    /* this._propService.getEstablecimiento(this._auth.usuario.uid)
    .subscribe(); */
  }

  getReservasPorFecha( evento: any ){
    let eventoFecha: string = evento.target.value;
    let fechaDiv = eventoFecha.slice(0, 10);
    this.fechaBuscar = fechaDiv;
    this._propService.reservasLocal = [];
    
    
    this._angularFire.currentUser
    .then((uid) =>{
      this._propService.getUbicaciones(uid.uid)
      .subscribe((resp) => {
        for(let uid of resp.docs){
          this._propService.getReservasLocal(uid.id)
          .subscribe((resp) =>{
            
            for(let r of resp.docs){
              
              this.reservasLocal = [];
                this._futbol.getUserByLocal(r.data().usuario.uidUser)
                .subscribe((user) =>{
                  for(let u of user.docs){
                    if(this.fechaBuscar !== ""){
                      this.reservasLocal.push({data: r.data().dataReserva.filter(a => (a.activo === true && a.fechaReserva === fechaDiv)), nombreUser: r.data().usuario.nombreUser = u.data().nombre, id: r.id ,extra: r.data()});
                    }else{
                      this.reservasLocal.push({data: r.data().dataReserva.filter(a => (a.activo === true)), nombreUser: r.data().usuario.nombreUser = u.data().nombre, id: r.id, extra: r.data()});
                    }
                  }
                }, (err) =>{

                });
              }
            
          }, (err) =>{
          })
        }
      }, (err) =>{

      })
    })
    .catch((err) =>{

    })
    
  }

  getIdDoc(){
    
    
    this._angularFire.currentUser
    .then((uid)=>{
      this._propService.getUbicaciones(uid.uid)
        .subscribe((id) =>{
          for(let uid of id.docs){
            this.idUbicaciones = uid.id;
            this._propService.getReservasLocal(uid.id)
            .subscribe((resp) =>{
              
              for(let r of resp.docChanges()){
                this.reservasLocal = [];
                  this._futbol.getUserByLocal(r.doc.data().usuario.uidUser)
                  .subscribe((user) =>{
                    for(let u of user.docs){
                      this.reservasLocal.push({data: r.doc.data().dataReserva.filter(a => a.activo === true), nombreUser: r.doc.data().usuario.nombreUser = u.data().nombre, id: r.doc.id, extra: r.doc.data()});
                    }
                  }, (err) =>{
  
                  });
                }
              
            }, (err) =>{
            })
          }
        }, (err) =>{
          
          this.reservasLocal = [];
        }).closed;
    })
    .catch((err)=>{
      this.reservasLocal = [];

    });
        
          
  }

  getReservas (IdDocReserva: string, ){
    
  }

  async quitarReserva(dataReserva: ReservaData, idDocReserva: string, extra: Reservas){
    const loadingCtrl = await this._loadingCtrl.create({
      message: 'Cancelando reserva, espere por favor',
      backdropDismiss: false,
      showBackdrop: true,
      spinner: 'crescent',
      translucent: true
    });

    const toastCtrl = await this._toastCtrl.create({
      message: 'Reserva cancelada con exito',
      duration: 1700,
      position: 'bottom',
      translucent: true,
    });
    const alert = await this._alertCtrl.create({
      header: 'Confirmación',
      message: `Esta seguro de cancelar la reserva ${ dataReserva.id } para el día ${ dataReserva.fechaReserva}`,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text:'Aceptar',
        role: 'aceptar',

        handler: (observacion) => {
          
          
        }
      }],
      inputs: [{
        name: 'motivo',
        type: 'textarea',
        id  : 'observacion',
        placeholder: 'Escriba un motivo para cancelar la reserva',
      }],
    
    });

    await alert.present();

    const {data} = await alert.onDidDismiss();
    
    
    if(data.values.motivo === ""){
    }else{
      let dataCancelar = {
        ...dataReserva,
        cancelacion: {motivo: data.values.motivo, cancelado: true, fecha: new Date().getTime()},
        activo: false
      }
      let dataRemover = {
        ...dataReserva,
        activo: true,
        cancelacion: {motivo: "", cancelado: false, fecha: 0}
      }
      loadingCtrl.present();
      this._propService.actualizarReserva(idDocReserva, dataCancelar)
      .then((resp) => {
        
        this._propService.removerReserva(idDocReserva, dataRemover)
        .then(() => {
          

          this._noti.obtenerTokenFirebase(extra.usuario.uidUser)
          .subscribe(() =>{
            loadingCtrl.dismiss();
            if(this._noti.token === ""){

            }else{
              this._noti.enviarNotificacion('Reserva cancelada', extra.local.nomLocal, this._noti.token, data.values.motivo, extra.usuario.uidUser, 'reservas cancelar', "notificaciones", dataReserva.id)
              .subscribe(() =>{
                toastCtrl.present();
                
              }, (err) =>{
                loadingCtrl.dismiss();
              })
            }
          }, (err) =>{
            loadingCtrl.dismiss();
          });
          this.horarioReserva(dataReserva);
          this.getIdDoc();
        }).catch((err) =>{
          loadingCtrl.dismiss();
        });
        
      });
      
    }
    
  }
  
  horarioReserva(dataReserva: ReservaData){
    
    this._futbol.getHorarioReservas(this.idUbicaciones)
        .subscribe((resp) =>{
          
          let dataExtra: any = {};
          let dataExtraEliminar: any = {};
          if(!resp.empty){
            
            
            for(let i of resp.docs){
              if(i.data().dataExtra.length > 0){
                
                
                for(let a of i.data().dataExtra){
                  if(dataReserva.horaInicio === a.hora && dataReserva.diaFecha === a.diaFecha){
                    
                    let resta = Number.parseInt(dataReserva.cantidad) - a.cantidad;
                    if(resta < 0){
                      resta = resta *(-1);
                    }else{
                      resta = resta;
                    }
                  
                    dataExtra = {
                      hora: dataReserva.horaInicio,
                      cantidad: resta,
                      activo: true,
                      diaFecha: dataReserva.diaFecha,
                      fechaTime: dataReserva.fechaTiempoReserva
                      
                    }
                    dataExtraEliminar = {
                      hora: a.hora,
                      cantidad: a.cantidad,
                      activo: true,
                      diaFecha: a.diaFecha,
                      fechaTime: a.fechaTime
                    }
                    
                  }
                } 
                this._futbol.eliminarHorario(i.id, dataExtraEliminar)
                .then(() =>{
                  
                  this._futbol.actualizarHorarioReservas(i.id, dataExtra)
                  .then(()=>{
                    
                
                  
                  }).catch((err) =>{});
                }).catch((err) =>{
                  
                });
              }
            }
          }
        });
  }

  //funcion para abrir la informacion
  async informacion(idOfReserva: string){
    this._propService.getIdDocOfUbicaciones(this._auth.usuario.uid)
    .subscribe(async () => {
      
      
      
      
      const modal = await this._modalCtrl.create({
        component: InformacionClientePage,
        componentProps:{
          idReserva: idOfReserva,
          idDocLocal: this._propService.idDocReserva
        }
      });
  
      await modal.present();
    }, (errno) => {});
    
  }

  //cambiar de true a false 
  async cambiarActivoNoActivo(){
    this._angularFire.currentUser
    .then((user) =>{
      let fecha = new Date();
      
      this._propService.getUbicaciones(user.uid)
      .subscribe((resp) =>{
        for(let id of resp.docs){
          this._propService.getReservasLocal(id.id)
          .subscribe((re) =>{
            for(let r of re.docs){
              for(let d of r.data().dataReserva){
                if(d.activo){

                  if(d.fechaTiempoReserva > fecha.getTime()){
                    
                    
                  }else{
                    
                    
                    let agregar = {
                      ...d,
                      activo: false
                    }
                    let borrar = {
                      ...d,
                      activo: true
                    }
                    this._propService.getReservasId(r.data().usuario.uidUser, r.data().local.idDocLocal)
                    .subscribe((resp) =>{
                      
                      for(let idDoc of resp.docs){
                        this._propService.actualizarReservaIndividual(idDoc.id, agregar)
                        .then(() =>{
                          
                          
                          this._propService.borrarReserva(idDoc.id, borrar)
                          .then(() =>{
                            
                            
                          }).catch((err) =>{
                            
                            
                          });
                        })
                        .catch((err) =>{
                          
                          
                        });

                      }
                    }, (err) =>{

                    });
                    
                    
                  }
                }
              }
            }
            
          }, (err) =>{

          })
        }
        
      }, (err) =>{

      })
    })
    .catch((err) =>{
      
    })

  }

  // funcion para cargar nuevas reservas

  async recargar(e:any){
    await this.cambiarActivoNoActivo();
    const cargando = await this._loadingCtrl.create({
      message: 'Verificando',
      backdropDismiss: true,
      spinner: 'crescent',
      showBackdrop:true
    });

    cargando.present();
    setTimeout(() => {
      e.target.complete();
      cargando.dismiss();
      this.getIdDoc();
    }, 250);
  }
  

  ngOnDestroy(){
    if(!this._auth.usuario.uid){
      this.reservasLocal = [];
      this.reservasLocalAuxiliar = [];

    }
    
  }


}
