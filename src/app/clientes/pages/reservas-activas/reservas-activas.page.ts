import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { Reservas } from 'src/app/interfaces/interfaces.futbol';
import { FutbolInnService } from 'src/app/services/futbol-inn.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { PropietarioSService } from '../../../services/propietario-s.service';



@Component({
  selector: 'app-reservas-activas',
  templateUrl: './reservas-activas.page.html',
  styleUrls: ['./reservas-activas.page.scss'],
})
export class ReservasActivasPage implements OnInit {
  fechaBuscar: string;
  fecha = moment().format('YYYY-MM-DD');
  dayCortos = ['Dom.', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];
  fechaMin = this.fecha;
  reservasLocal: any[] = [];
  idDocLocal: string;
  reservasLocalFechas: any[] = [];

  constructor(
    private _futbolService: FutbolInnService,
    private _storage: AlmacenamientoService,
    private _loadingCtrl: LoadingController,
    private _auth: AuthService,
  ) { }

  ngOnInit() {
    
  }

  async ionViewDidEnter(){
    await this.cambiarActivoNoActivo();
    this.getReservasLocal();

  }

  



  getReservasLocal(){
    let diaFechaActual = moment().format('YYYY-MM-DD').toString();
    
    
    this._storage.getData('idDocLocal')
    .then((idDocLocal) => {
      this._futbolService.getDocReserva(idDocLocal)
      .subscribe( (respDataLocal) => {
      
        
        this.reservasLocal = [];
        
        for(let f of respDataLocal){
          for(let r of f.dataReserva){
            if(r.activo){

              this.reservasLocal.push(r);
            }
          }
        }
      
        
      });
    }).catch( (errno) => {
      
      
    });
    
  }

  

  //funcion para mostrar reservas en base a la fecha
  getReservasPorFecha(evento:any){
    let fecha: string = evento.target.value;
    this.fechaBuscar = evento.target.value;
    this.fechaBuscar = this.fechaBuscar.slice(0, 10);
    let fechaDia:string = fecha.slice(0, 10);
    this.reservasLocal = [];
    this._futbolService.getReservasByFecha(fechaDia, this.idDocLocal)
    .subscribe( data => {
      data.forEach( respReservasFecha => {
        respReservasFecha.payload.doc.data().dataReserva.forEach( dataReserva => {
          if(dataReserva.fechaReserva === fechaDia){
            //this.reservasLocal.push(dataReserva);
          }
        });
        
      });
      
    })

    
    
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
  
    await loading.present();
    this._storage.getData('idDocLocal')
    .then((r) =>{

    
    this._futbolService.getDocReserva(r)
    .subscribe((resp) =>{
      
      if(resp.length > 0){

        for(let r of resp){
          
          for(let data of r.dataReserva){
            if(data.activo){
              
              loading.dismiss();
              if(data.fechaTiempoReserva > fecha.getTime()){
                
                
              }else{
                
                
                let agregar = {
                  ...data,
                  activo: false
                }
                let borrar = {
                  ...data,
                  activo: true
                }
                
                this._futbolService.getReservasId(r.usuario.uidUser, r.local.idDocLocal)
                .subscribe((id) =>{
                  for(let uid of id.docs){
                    
                    this._futbolService.actualizarReservaIndividual(uid.id, agregar)
                    .then(() =>{
                      
                      this._futbolService.borrarReserva(uid.id, borrar)
                      .then(() =>{
                        
                        
                      })
                      .catch((err) =>{
                        
                        
                      });
                    })
                    .catch((err) =>{
                      
                      
                    });
                  }
                  
                }, (err) =>{
  
                })
              }
              loading.dismiss();
            }else{
              
              loading.dismiss();
              
              
            }
          }
        }
      }else{
        loading.dismiss();
      }
      
    }, (err) =>{
      
      loading.dismiss();
    });
  })
    
    
    /* this._futbolInn.cambiarActivo(r.local.idDocLocal, r.usuario.uidUser)
    .subscribe((cambio) =>{
      
    }, (err) =>{

    }) */
  }

}
