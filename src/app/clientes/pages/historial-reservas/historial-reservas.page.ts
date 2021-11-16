import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import * as moment from 'moment';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AuthService } from '../../../services/auth.service';
import { MenuController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-historial-reservas',
  templateUrl: './historial-reservas.page.html',
  styleUrls: ['./historial-reservas.page.scss'],
})
export class HistorialReservasPage implements AfterViewInit {
  anioActual = moment().year();
  fechaMax = moment().format('YYYY-MM-DD');
  historialReservas: any[]= [];
  fechaBuscar: number = 0;
  selectNombre: any[] = [];
  selectNombreAuxiliar = [];
  cambioLocalStr: string = "";
  cambioLocalBool: boolean = false;
  cambioFechaBool: boolean = false;
  cambioFecha: string = "";
  fechaBuscarString: string = '';
  customActionSheetOptions:any = {
    header: 'Seleccione un establecimiento'
  }
  customPickerOptions: any;
  

  constructor(
    private _futbolInn: FutbolInnService,
    private _auth: AuthService,
    private _menu: MenuController,
    private _loadingCtrl: LoadingController
  ) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Quitar Fecha',
        handler: (evento) => {
          this.fechaBuscarString = "";
        }
      }, {
        text: 'Aceptar',
        handler: (evento) => {
          let fecha = new Date();
          let horas = fecha.getHours();
          let minutos = fecha.getHours();
          let anio = Number.parseInt(evento.year.text);
          let mes = (Number.parseInt(evento.month.text)) - 1;
          let dia = Number.parseInt(evento.day.text);
          this.fechaBuscar = new Date(anio, mes, dia, horas, minutos, 0).getTime();
          this.fechaBuscarString =`${ evento.year.text}-${ evento.month.text }-${ evento.day.text }`;
        }
      }, {
        text: 'Cancelar',
        handler: (evento) => {
          
        }
      }

    ]
    }
    

   }

  
  ngAfterViewInit(){
    this.getNombreEstablecimiento();
  }
  
  async ionViewDidEnter(){
    await this.cambiarActivoNoActivo();
    
    this.getReservasUser();

  }

  //funcion para abrir un menu en especifico
  abrirMenu(){
    this._menu.enable(true, 'cliente');
    this._menu.open('cliente');
  }

  async cambiarActivoNoActivo(){

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
    
    this._futbolInn.getReservasByUser(this._auth.usuario.uid)
    .subscribe((resp) =>{
      
      if(resp.length > 0){

        for(let r of resp){
          
          for(let data of r.dataReserva){
            if(data.activo){
              
              
              if(data.fechaTiempoReserva < fecha.getTime()){
                
                
                
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
                        loading.dismiss();
                        
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
    
    
    /* this._futbolInn.cambiarActivo(r.local.idDocLocal, r.usuario.uidUser)
    .subscribe((cambio) =>{
      
    }, (err) =>{

    }) */
  }


  getReservasUser(){
    
    this._futbolInn.getReservasByUserLocal(this._auth.usuario.uid)
    .subscribe( respDataReserva => {
      let fecha = new Date().getTime();
      
      this.historialReservas= [];
      for(let datos of respDataReserva.docs){
          for(let d of datos.data().dataReserva){
            if(!d.activo){
                
              this.historialReservas.push({respLocal: datos.data().local, respUser: datos.data().usuario, data: d});
                /* if(d.fechaTiempoReserva < fecha){
                } */
                
              }
            }
        }
        
        
        
    }, (err) =>{

    });  
  }
  
  getNombreEstablecimiento(){
    
    
    this._futbolInn.getReservasByUser(this._auth.usuario.uid)
    .subscribe( data => {
      this.selectNombre = [];
      for(let d of  data){
        for(let f of d.dataReserva){
          if(!f.activo){
            this.selectNombreAuxiliar.push(d.local.nomLocal);
            
            
          }
        }
      }
      this.selectNombre.push(this.selectNombreAuxiliar.filter((item, index) =>{
        return this.selectNombreAuxiliar.indexOf(item) === index;
      }));
      
      
    });
    

  }

  BuscarFecha( evento:any ){
    this.fechaBuscarString = evento.target.value;
    this.historialReservas = [];
    this.cambioFecha = evento.target.value;
    this.cambioFechaBool = true;
    /* if(evento.target.value == ""){
      this.cambioFechaBool = false;
    }else{
      this.cambioFechaBool = true;
    } */
    
    

    this._futbolInn.getReservasByUser(this._auth.usuario.uid)
    .subscribe((respData) => {
      
      this.historialReservas = [];
      for(let d of respData){
        
        
        this._futbolInn.getSearchEstablecimiento(d.local.idDocLocal)
        .subscribe((respLocal) =>{
          for(let r of d.dataReserva){
            if(!r.activo && r.fechaReserva === this.fechaBuscarString && this.cambioLocalStr === ""){
              
              this.historialReservas.push({respLocal: respLocal.data(), data: r});

            }else if(!r.activo && this.fechaBuscarString === "" && this.cambioLocalStr === d.local.nomLocal){
              this.historialReservas.push({respLocal: respLocal.data(), data: r});

            }else if(!r.activo && r.fechaReserva === this.fechaBuscarString && this.cambioLocalStr === d.local.nomLocal){
              this.historialReservas.push({respLocal: respLocal.data(), data: r});

            }else if(!r.activo && this.fechaBuscarString === r.fechaReserva && this.cambioLocalStr === "t"){
              this.historialReservas.push({respLocal: respLocal.data(), data: r});
            }else if(!r.activo && this.fechaBuscarString === "" && this.cambioLocalStr === "t"){
              this.historialReservas.push({respLocal: respLocal.data(), data: r});
              
            }else if(!r.activo && this.fechaBuscarString === "" && this.cambioLocalStr === ""){
              this.historialReservas.push({respLocal: respLocal.data(), data: r});

            }
          }
        }, (err) =>{

        })
      }
    }, (err) =>{

    });
         
    
    
    
  }

  cambioLocal( evento: any){
    
    this.historialReservas = [];
    this.cambioLocalStr = evento.target.value;
    this.cambioLocalBool = true;
    if(evento.target.value == "t"){
      this.cambioLocalBool = false;
    }else{
      this.cambioLocalBool = true;
    }
    
        this._futbolInn.getReservasByUser(this._auth.usuario.uid)
        .subscribe( respDataReserva => {
          respDataReserva.filter(data => {
            this._futbolInn.getSearchEstablecimiento(data.local.idDocLocal)
            .subscribe(respLocal => {
              

              
              data.dataReserva.filter( dataRespReserva => {
                
                /* if(respLocal.nomLocal === evento.target.value && dataRespReserva.activo == false && dataRespReserva.fechaReserva === this.cambioFecha && this.cambioFechaBool){
                  this.historialReservas.push({respLocal, data: dataRespReserva});
                }else if(respLocal.nomLocal === evento.target.value && dataRespReserva.activo == false ){
                  this.historialReservas.push({respLocal, data: dataRespReserva});

                } */
                if(respLocal.data().nomLocal === evento.target.value && dataRespReserva.activo == false && dataRespReserva.fechaReserva === this.cambioFecha){
                  this.historialReservas.push({respLocal: respLocal.data(), data: dataRespReserva});
                }else if(evento.target.value === "t" && dataRespReserva.activo === false && dataRespReserva.fechaReserva === this.cambioFecha){
                  
                  
                  this.historialReservas.push({respLocal: respLocal.data(), data: dataRespReserva});
                  
                  
                }else if(evento.target.value === "t" && dataRespReserva.activo == false &&  this.cambioFecha === ""){
                  
                  this.historialReservas.push({respLocal: respLocal.data(), data: dataRespReserva});
                  
                  
                  
                  
                }else if(evento.target.value === respLocal.data().nomLocal && dataRespReserva.activo == false &&  this.cambioFecha === ""){
                  
                  this.historialReservas.push({respLocal: respLocal.data(), data: dataRespReserva});
                  
                  
                }
              });
              /* data.payload.doc.data().dataReserva.filter( dataRespReserva => {
              }); */
            })
          });
          
        });
              
      
    
    
  }

}
