import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reservas-activas-cliente',
  templateUrl: './reservas-activas-cliente.page.html',
  styleUrls: ['./reservas-activas-cliente.page.scss'],
})
export class ReservasActivasClientePage implements OnInit {
  historialReservas:any[] = [];
  selectNombre: any[] = [];
  anioActual = moment().year();
  cambioLocalStr: string = "";
  cambioFecha: string = "";
  fechaBuscar: string = "";
  cambioLocalBool: boolean = false;
  cambioFechaBool: boolean = false;
  customPickerOptions:any;
  selectNombreAuxiliar: any[] = [];

  fechaMin = moment().format('YYYY-MM-DD');

  customActionSheetOptions: any = {
    header: 'Seleccione un establecimiento'
  }

  constructor(
    private _futbolInn: FutbolInnService,
    private _auth: AuthService,
    private _loadingCtrl: LoadingController
  ) { 
    this.customPickerOptions = {
      buttons: [{
        text: 'Quitar Fecha',
        handler: (evento) => {
          this.fechaBuscar = "";
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
  
  async ionViewDidEnter(){
    const loading = await this._loadingCtrl.create({
      spinner: 'crescent',
      message: 'Espere por favor, estamos cargando la data',
      showBackdrop: true,
      translucent: true,
      animated: true,
      backdropDismiss: false,      
    });
  
    await loading.present();
    this.cambiarActivoNoActivo();
    this.getNombreEstablecimiento();
    setTimeout(() =>{
      this.getReservasByUser();
      loading.dismiss();
    }, 400)
  }

  async getReservasByUser(){
    
    this._futbolInn.getReservasByUserLocal(this._auth.usuario.uid)
    .subscribe( respDataReserva => {
      
      
      this.historialReservas = [];
      for(let r of respDataReserva.docs){
        for(let f of r.data().dataReserva){
          if(f.activo === true){
            this._futbolInn.getSearchEstablecimiento(r.data().local.idDocLocal)
            .subscribe(respLocal => {
              this.historialReservas.push({respLocal: respLocal.data(), data: f, fotos: respLocal.data().foto});
            });
            
          }
        }
      }
      
    });
              
      
  }

  BuscarFecha( evento: any ){
    this.fechaBuscar = evento.target.value;
    this.fechaBuscar = this.fechaBuscar.slice(0, 10);
    this.cambioFecha = evento.target.value;
    
    
    
    if(evento.target.value == ""){
      this.cambioFechaBool = false;
    }else{
      this.cambioFechaBool = true;
    }
    
        this._futbolInn.getReservasByUser(this._auth.usuario.uid)
        .subscribe( respDataReserva => {
          
          this.historialReservas = [];
          respDataReserva.map( respReserva => {
            
            respReserva.dataReserva.map( respDataR => {
              
              if(respDataR.activo && respDataR.fechaReserva === this.fechaBuscar && respReserva.local.nomLocal === this.cambioLocalStr){
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
              }else if(respDataR.activo && this.fechaBuscar === "" && respReserva.local.nomLocal === this.cambioLocalStr){
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
                
              }else if(respDataR.activo && respDataR.fechaReserva === this.fechaBuscar && this.cambioLocalStr === ""){
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
                
              }else if(respDataR.activo && this.fechaBuscar === "" && this.cambioLocalStr == ""){
                
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
              }else if(respDataR.activo && respDataR.fechaReserva === this.fechaBuscar && this.cambioLocalStr === "t"){
                
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
              
              }else if(respDataR.activo && this.fechaBuscar === "" && this.cambioLocalStr === "t"){
                
                this.historialReservas.push({respLocal: respReserva.local, data: respDataR})
              }
              
            });
          });
        });
              
      

  }

  cambioLocal( evento:any ){
    
    this.historialReservas = [];
    this.cambioLocalStr = evento.target.value;
    
    
    if(evento.target.value == "t"){
      this.cambioLocalBool = false;
    }else{
      this.cambioLocalBool = true;
    }
    
        this._futbolInn.getReservasByUser(this._auth.usuario.uid)
        .subscribe( respDataReserva => {
          respDataReserva.filter(data => {

              
              data.dataReserva.filter( dataRespReserva => {
                
                if(data.local.nomLocal === evento.target.value && dataRespReserva.activo && dataRespReserva.fechaReserva === this.cambioFecha){
                  this.historialReservas.push({respLocal: data.local, data: dataRespReserva});
                }else if(evento.target.value === "t" && dataRespReserva.activo && dataRespReserva.fechaReserva === this.cambioFecha){
                  
                  this.historialReservas.push({respLocal: data.local, data: dataRespReserva});
                  
                  
                }else if(evento.target.value === "t" && dataRespReserva.activo &&  this.cambioFecha === ""){
                  
                  this.historialReservas.push({respLocal: data.local, data: dataRespReserva});
                  
                }else if(evento.target.value === data.local.nomLocal && dataRespReserva.activo &&  this.cambioFecha === ""){
                  
                  this.historialReservas.push({respLocal: data.local, data: dataRespReserva});
                }
              });
          });
          
        });
  }

  getNombreEstablecimiento(){
    
    this._futbolInn.getReservasByUser(this._auth.usuario.uid)
    .subscribe( data => {
      this.selectNombre = [];
      for(let d of  data){
        for(let f of d.dataReserva){
          if(f.activo){
            this.selectNombreAuxiliar.push(d.local.nomLocal);
          }
        }
      }
      this.selectNombre.push(this.selectNombreAuxiliar.filter((item, index) =>{
        return this.selectNombreAuxiliar.indexOf(item) === index;
      }));
      
      
    });

  }
  //funcion para cambiar de true a false

  async cambiarActivoNoActivo(){

    const min = 60;
    let fecha = new Date();
    this._futbolInn.getReservasByUser(this._auth.usuario.uid)
    .subscribe((resp) =>{
      
      
      
      for(let r of resp){
        for(let data of r.dataReserva){
          if(data.activo){
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
              
              this._futbolInn.getReservasId(r.usuario.uidUser, r.local.idDocLocal)
              .subscribe((id) =>{
                for(let uid of id.docs){
                  
                  this._futbolInn.actualizarReservaIndividual(uid.id, agregar)
                  .then(() =>{
                    
                    this._futbolInn.borrarReserva(uid.id, borrar)
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
          }
        }
      }
    }, (err) =>{
      
    });
  }
    
        
     
}
