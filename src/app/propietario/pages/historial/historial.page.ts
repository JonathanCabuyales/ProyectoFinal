import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { AuthService } from '../../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  customPickerOptions: any;
  fechaBuscar: string = "";
  selectNombre: any[]= [];
  reservasLocal: any[] = [];
  anioActual: any;
  fechaMax: any;
  existe: boolean = false;
  dayCortos = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  customActionSheetOptions = {
    header: 'Seleccione un establecimiento'
  }
  constructor(
    private _loadingCtrl: LoadingController,
    private _propService: PropietarioSService,
    private _auth: AuthService,
    private _futbolInn: FutbolInnService,
    private _angularFire: AngularFireAuth
  ) {
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
  
  ionViewDidEnter(){
    this.cambiarActivoNoActivo();
    
    setTimeout(() => {
      this.getHistorialReserva();
    }, 400);
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
                this._futbolInn.getUserByLocal(r.data().usuario.uidUser)
                .subscribe((user) =>{
                  for(let u of user.docs){
                    if(this.fechaBuscar !== ""){
                      this.reservasLocal.push({data: r.data().dataReserva.filter(a => (a.activo === false && a.fechaReserva === fechaDiv)), nombreUser: r.data().usuario.nombreUser = u.data().nombre});
                    }else{
                      this.reservasLocal.push({data: r.data().dataReserva.filter(a => (a.activo === false)), nombreUser: r.data().usuario.nombreUser = u.data().nombre});
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

  cambioLocal(evento: any){
  }

  async cambiarActivoNoActivo(){
    const min = 60;
    let fecha = new Date();
    const loading = await this._loadingCtrl.create({
      spinner: 'crescent',
      message: 'Espere por favor, estamos cargando la data',
      showBackdrop: true,
      translucent: true,
      animated: true,
      backdropDismiss: false,      
    });

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
  
  //funcion para obtener los datos del historial
  getHistorialReserva(){
    
    
    this._angularFire.currentUser
    .then((uid)=>{
      this._propService.getUbicaciones(uid.uid)
        .subscribe((id) =>{
          for(let uid of id.docs){
            this._propService.getReservasLocal(uid.id)
            .subscribe((resp) =>{
              
              for(let r of resp.docChanges()){
                this.reservasLocal = [];
                  this._futbolInn.getUserByLocal(r.doc.data().usuario.uidUser)
                  .subscribe((user) =>{
                    for(let u of user.docs){ 
                      this.reservasLocal.push({data: r.doc.data().dataReserva.filter(a => a.activo === false), nombreUser: r.doc.data().usuario.nombreUser = u.data().nombre});
                    }
                    console.log(this.reservasLocal);
                    
                    
                    
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


}
