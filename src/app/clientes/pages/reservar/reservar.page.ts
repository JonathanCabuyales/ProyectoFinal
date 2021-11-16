
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { datosPersonales } from 'src/app/interfaces/interfaces.futbol';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RespUbicaciones } from '../../../interfaces/interfaces.futbol';
import { FutbolInnService } from 'src/app/services/futbol-inn.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import * as moment from 'moment';
import 'moment/locale/es';
import { combineLatest, Subscription } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { UbicacionMapaComponent } from '../../components/ubicacion-mapa/ubicacion-mapa.component';
import { AuthService } from '../../../services/auth.service';
import { NotificacionesService } from '../../../services/notificaciones.service';



@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage implements OnInit, AfterViewInit, OnDestroy {

  formularioReserva: FormGroup;
  datosLocal: RespUbicaciones[] = [];
  diaSemana: any[] = [];
  fechaDia: any[] = [];
  mesDia: any[] = [];
  horasGenerico: any[]= [];
  default: any = "";
  horasTiempoJugar: any[];
  idDocLocal: string = "";
  segmentFecha: any;
  horaFin: string = "";
  tiempoJugar: any;
  fechaCompletaReservar: any[] = [];
  nombreLocal: string = "";
  idDocUser: string = '';
  canchasDisponibles: any[] =  [];
  numCanchas: number = 0;
  searchLocal: Subscription;
  constructor(
    private _formBuilder: FormBuilder,
    public _futbolService: FutbolInnService,
    private _storage: AlmacenamientoService,
    private _modalCtrl: ModalController,
    private _auth: AuthService,
    private _noti: NotificacionesService,
    private _loadingCtrl: LoadingController
  ) {
    
   }

  ngOnInit() {
    
    this.crearFormulario();
    /* this.getCanchasDisponibles(); */
    
  }
  ngAfterViewInit(){
  }
  
  ionViewDidEnter(){
    this.getDatosPersonales();
    this.getDatosLocales();
    this.mostrarDia();
  }
  ionViewDidLeave(){
    // this.mostrarDia()
    this.horasGenerico.splice(0, this.horasGenerico.length);
    this.horasGenerico.length = 0;
  }
  
  //funcion para mostrar datos del usuario
  getDatosPersonales(){
    
        try {
          this._futbolService.getUserByIdDoc(this._auth.usuario.uid).subscribe(() => {
            this.idDocUser = this._futbolService.idDoUser;
          }, (errno) => {});
        } catch (error) {
          
        }
     
  }
  
  //funcion apra traer datos del local
  getDatosLocales(){
    this._storage.getData('idDocLocal')
    .then( local =>{
      
      
      this._futbolService.getSearchEstablecimiento(local)
      .subscribe( data => {
        this.datosLocal = [];
        
        this.idDocLocal = data.id;
        this.nombreLocal = data.data().nomLocal;
        this.numCanchas = data.data().numCanchas;
        this.datosLocal.push(data.data());

      });
    });
  }


  

  //funcion para cambiar la fecha
  cambioFecha( evento:any ){
    
    
    this.segmentFecha = Number.parseInt(evento.detail.value);
    this.formularioReserva.setValue({
      diaFecha: this.segmentFecha,
      hora: '',
      cantidad: '',
      tiempo: '',
      observaciones: '',
    });
    
    
    this.horasReservar(this.fechaDia[this.segmentFecha], this.diaSemana[this.segmentFecha], this.segmentFecha);

  }

  horasReservar( fechaDia: string, diaSemana: string, idDia: string){
    let diaActual = moment().format('DD');

    
    const dia = 24;
    const minHora = 60;
    let horarioEstablecimieto: string;
    let inicioHora:any;
    let finHora:any;
    let diferenciaHoras:any;
    let horaActual = moment();
    let minRestantes = (horaActual.minutes() - minHora)*(-1);
    let minActuales = horaActual.add(minRestantes, 'minutes').minutes();
    this.horasGenerico = [];
    this.horasTiempoJugar = [];
    
    
    
    
    
    this.searchLocal = this._futbolService.searchEstablecimiento(this.idDocLocal)
    .subscribe( e => {
      this.horasGenerico.splice(0, this.horasGenerico.length);
      this.horasGenerico.length = 0;
      if(diaSemana === 'dom.' || diaSemana === 'sáb.'){
        horarioEstablecimieto = e.horarios['finSemana']['hora'];
        this.horaFin = horarioEstablecimieto.slice(8, 13);
      }else{
        horarioEstablecimieto = e.horarios['semana']['hora'];
        this.horaFin = horarioEstablecimieto.slice(8,13);
      }

      
      

      

      

      
      if(Number.parseInt(fechaDia) === Number.parseInt(diaActual)){
        
        diferenciaHoras = (Number.parseInt(horarioEstablecimieto.slice(0,2)) - horaActual.hours())*(-1);
        
        
        if(minRestantes <= 59) {horaActual.add(1, 'hours');  }else{ horaActual.add(0, 'hours'); }
        inicioHora = moment(`${ horaActual.hours() }: ${ minActuales }0`, 'HH:mm');
        horaActual.add(diferenciaHoras, 'h');
        finHora = moment(horarioEstablecimieto.slice(8,13), 'HH:mm');
        while(inicioHora.isSameOrBefore(finHora)){
          this.horasGenerico.push(inicioHora.format('HH:mm'));
          inicioHora.add(1, 'h');
        }
      }else{
        inicioHora = moment(horarioEstablecimieto.slice(0, 5), 'HH:mm');
        finHora = moment(horarioEstablecimieto.slice(8, 13), 'HH:mm');
        while(inicioHora.isSameOrBefore(finHora)){
          this.horasGenerico.push(inicioHora.format('HH:mm'));
          inicioHora.add(1, 'h');
        }
      }
      
      
      this.comprobarHorasReservadas(fechaDia);
    });
  }

  // funcion para comprobar que las horas no esten reservardas
  comprobarHorasReservadas(fechadia: string){
    

    this._futbolService.getHorarioReservas(this.idDocLocal)
    .subscribe((respHoras: any) => { 
      
      if(!respHoras.empty){
        for(let f of respHoras.docs){
          for(let a of f.data().dataExtra){
            for(let h of this.horasGenerico){
              if(a.cantidad === this.numCanchas && h === a.hora && fechadia === a.diaFecha){
                let i = this.horasGenerico.indexOf(a.hora);
                
                this.horasGenerico.splice(i, 1);
              }
            }
          } 
        }
      }
      
      
      
    });

  }

  cambioHoratiempo( evento: any){
    
    let diaFecha = this.formularioReserva.get('diaFecha').value;
    let horaSiguiente = moment(evento.target.value, 'HH:mm').add(1, 'h');
    let horaSiguienteformato = `${horaSiguiente.hours()}:${horaSiguiente.minutes()}0`;
    this.tiempoJugar = 1;
    this.default = 1;
    let inicioHora = moment(evento.detail.value, 'HH:mm');
    let finHora = moment(this.horaFin, 'HH:mm');
    let horraIgual =false;
    
    
    this.tiempoJugar = this.tiempoJugar + ' hora';
    let diferenciasHoras: any;
    this.horasTiempoJugar = [];
    while(inicioHora.isSameOrBefore(finHora)){
      diferenciasHoras = ((inicioHora.hours() - finHora.hours())*-1) + 1;
      if(diferenciasHoras <=5){
        if(diferenciasHoras === 1){
          this.horasTiempoJugar.unshift({value: diferenciasHoras, name:' hora'});

        }else{
          this.horasTiempoJugar.unshift({value: diferenciasHoras, name:' horas'});
        }
      }
      inicioHora.add(1, 'h');
    }
    
    this.horasGenerico.forEach( m => {
      
      if(horaSiguienteformato === m){
        horraIgual = true;
        
      }
      
    });

    if(horraIgual){
      this.horasTiempoJugar = this.horasTiempoJugar;
    }else{
      this.horasTiempoJugar = [];
      this.horasTiempoJugar.unshift({value: 1, name:' hora'})
    }

    this._storage.getData('idDocLocal')
    .then( local =>{
      this._futbolService.getSearchEstablecimiento(local)
      .subscribe( data => {
        let restante: any = data.data().numCanchas;
        this._futbolService.getHorarioReservas(local)
        .subscribe((resp:any) =>{
          
          if(!resp.empty){
            for(let f of resp.docs){
              for(let a of f.data().dataExtra){
                if(evento.target.value === a.hora && this.fechaDia[diaFecha] === a.diaFecha){
                  restante = data.data().numCanchas - a.cantidad;
                  
                  break;
                }
              }
            }
          }
          
          
          this.canchasDisponibles = [];
          for(let i = 1; i <= restante; i++){
            this.canchasDisponibles.push(i);
          }
        })
      });
    });
    
    

  }

  modificarDatos(){}

  mostrarDia(agregar?: number){
    moment().locale('es');
    let desde: any;
    let hasta: any;
    let horaSemana: any;
    let horaFinSemana: any;
    this._storage.getData('idDocLocal')
    .then((idLocal) =>{
      this._futbolService.searchEstablecimiento(idLocal)
      .subscribe((data) =>{
        desde = moment();
        hasta = moment().add(7, 'd');
        
        
        
        if(desde.days() >=1 && desde.days() <=5){
          horaSemana = Number.parseInt(data.horarios.semana.hora.substring(8,10));
          if( desde.hours() >= horaSemana ){
            
            
            
            desde.add(1, 'days');
            
          }else{
            desde = desde;
            hasta = hasta;
          }
          
          
        }else if(desde.days() === 0 && desde.days() === 6){
          
          horaFinSemana = Number.parseInt(data.horarios.finSemana.hora.substring(8,10));
          if( desde.hours() >= horaFinSemana){
            desde.add(1, 'days');
          }else{
            desde = desde;
            hasta = hasta;
          }
          
          
        }
        if(agregar){
          desde.add(agregar, 'days');
          
        }else{
          desde.add(0, 'days');
        }
        this.diaSemana = [];
        this.fechaDia = [];
        this.mesDia = [];
        this.fechaCompletaReservar = [];
        
        while(desde.isSameOrBefore(hasta)){
          this.diaSemana.push(desde.format('ddd'));
          this.fechaDia.push(desde.format('DD'));
          this.mesDia.push(desde.format('MMM'));
          this.fechaCompletaReservar.push(desde.format('YYYY-MM-DD'))
          desde.add(1, 'd');
        }
      })
    });



    
  }

  //funcion para validar errores
  get errorDiaFecha(){
    return this.formularioReserva.get('diaFecha').invalid && this.formularioReserva.get('diaFecha').touched;
  }

  get errorHora(){
    return ;
  }

  get errorTiempo(){
    return;
  }

  get errorCantidad(){
    return ;
  }


  //funcion para guardar la reserva
  async guardar(evento: any){
    
    
    let diaFecha = this.formularioReserva.get('diaFecha').value;
    let horaReserva: string = this.formularioReserva.get('hora').value;
    let tiempoJugar = this.formularioReserva.get('tiempo').value;
    let cantidadCanchas = this.formularioReserva.get('cantidad').value;
    let observaciones = this.formularioReserva.get('observaciones').value;
    let horaFintiempo = moment(horaReserva, 'HH:mm').add(tiempoJugar, 'h');
    let horasTiempo = [];
    let horaReservaMoment = moment(horaReserva, 'HH:mm');
    let horaFInTiempoComparar = `${ horaFintiempo.hours()}:${ horaFintiempo.minutes() }0`;
    if(this.formularioReserva.invalid){
      Object.values( this.formularioReserva.controls )
      .forEach( control => {
        control.markAsTouched();
      });
    }

    if(tiempoJugar > 1){
      while(horaReservaMoment.isSameOrBefore(horaFintiempo)){
        horasTiempo.push(horaReservaMoment.format('HH:mm'));
        horaReservaMoment.add(1, 'h');
        
        horasTiempo = horasTiempo.filter( hora => hora !== horaFInTiempoComparar);
        
      }
    }else{
      horasTiempo = horasTiempo.filter( hora => hora === horaFInTiempoComparar);
      
    }
    let fechaAReservar: string = this.fechaCompletaReservar[this.segmentFecha];
    let fechadividir = fechaAReservar.split('-');
    
    let anio = Number.parseInt(fechadividir[0]);
    let mes =  Number.parseInt(fechadividir[1]) - 1 ;
    let dia =  Number.parseInt(fechadividir[2]);
    let horas = Number.parseInt(horaReserva.slice(0, 2));
    let minutos = Number.parseInt( horaReserva.slice(3, 5));
    let nuevaFecha = new Date(anio, mes, dia ,horas, minutos, 0);
    
    let id = this.generarId();
    let dataLocal = {
      nomLocal: this.nombreLocal,
      idDocLocal: this.idDocLocal
    }
    let dataFormulario = {
      id: id,
      dia: `${this.diaSemana[diaFecha]} ${ this.fechaDia[diaFecha] } ${ this.mesDia[diaFecha] }`,
      horaInicio: horaReserva,
      horaFin: `${ horaFintiempo.hours()}:${ horaFintiempo.minutes() }0`,
      horasReservadas: horasTiempo,
      tiempo: tiempoJugar,
      cantidad: cantidadCanchas,
      observaciones: observaciones,
      activo: true,
      diaFecha: `${ this.fechaDia[diaFecha] }`,
      fechaReservaHecha: `${ moment().year() }-${ moment().month() + 1 }-0${ moment().date() }`,
      fechaReserva: `${ this.fechaCompletaReservar[this.segmentFecha] }`,
      fechaTiempoReserva: nuevaFecha.getTime(),
      cancelacion: {
        cancelado: false,
        motivo: "",
        fecha: 0
      }
    }
    let dataExtra: any = {};
    let dataExtraEliminar: any ={};
    const loading = await this._loadingCtrl.create({
      message: 'Espere por favor, se esta guardando la reserva',
      spinner: 'circular',
      translucent: true,
      backdropDismiss: false
    });
    combineLatest([
      this._storage.getData('idDocLocal')
    ])
    .subscribe(([idDocLocal]) => {
      
        
        this._futbolService.getHorarioReservas(idDocLocal)
        .subscribe((resp) =>{
          
          
          if(!resp.empty){
            
            
            for(let i of resp.docs){
              if(i.data().dataExtra.length > 0){
                
                
                for(let a of i.data().dataExtra){
                  if(horaReserva === a.hora && this.fechaDia[diaFecha] === a.diaFecha){
                    
                  
                    dataExtra = {
                      hora: horaReserva,
                      cantidad: cantidadCanchas + a.cantidad,
                      activo: true,
                      diaFecha: this.fechaDia[diaFecha],
                      fechaTime: nuevaFecha.getTime()
                      
                    }
                    dataExtraEliminar = {
                      hora: horaReserva,
                      cantidad: a.cantidad,
                      activo: true,
                      diaFecha: this.fechaDia[diaFecha],
                      fechaTime: a.fechaTime
                    }
                    
                    
                    
                    break;
                  }else if(horaReserva !== a.hora && this.fechaDia[diaFecha] === a.diaFecha){
                    
                    
                    dataExtra = {
                      hora: horaReserva,
                      cantidad: cantidadCanchas + 0,
                      activo: true,
                      diaFecha: this.fechaDia[diaFecha],
                      fechaTime: nuevaFecha.getTime()
                    }
                    dataExtraEliminar = {
                    }
                  }else if( horaReserva === a.hora && this.fechaDia[diaFecha] !== a.diaFecha){
                    dataExtra = {
                      hora: horaReserva,
                      cantidad: cantidadCanchas + 0,
                      activo: true,
                      diaFecha: this.fechaDia[diaFecha],
                      fechaTime: nuevaFecha.getTime()
                    }
                    dataExtraEliminar = {
                    }
                  }else if( horaReserva !== a.hora && this.fechaDia[diaFecha] !== a.diaFecha){
                    dataExtra = {
                      hora: horaReserva,
                      cantidad: cantidadCanchas + 0,
                      activo: true,
                      diaFecha: this.fechaDia[diaFecha],
                      fechaTime: nuevaFecha.getTime()
                    }
                    dataExtraEliminar = {
                    }
                  }
                } 
                this._futbolService.eliminarHorario(i.id, dataExtraEliminar)
                .then(() =>{
                  
                  this._futbolService.actualizarHorarioReservas(i.id, dataExtra)
                  .then(()=>{
                    
                
                  
                  }).catch((err) =>{});
                }).catch((err) =>{
                  
                });
              }else{
                
                dataExtra ={
                  hora: horaReserva,
                  cantidad: cantidadCanchas + 0,
                  activo: true,
                  diaFecha: this.fechaDia[diaFecha],
                  fechaTime: nuevaFecha.getTime()
                }
                this._futbolService.actualizarHorarioReservas(i.id, dataExtra)
                .then(() =>{
                  
                  
                }).catch((err) =>{});
              }
            }
          }else{
            
            
            dataExtra = {
              hora: horaReserva,
              cantidad: cantidadCanchas + 0,
              activo: true,
              diaFecha: this.fechaDia[diaFecha],
              fechaTime: nuevaFecha.getTime()
            }
            this._futbolService.horarioReservas(dataExtra, dataLocal)
            .then(() =>{
              
              
            }).catch((err) =>{});
          }
        });
        
        if(this.idDocLocal === idDocLocal && this.idDocUser === this._auth.usuario.uid){
          

          this._futbolService.getIdDocOfReservas(idDocLocal, this._auth.usuario.uid)
          .subscribe((dataReserva: any) => {
            
            
            if(dataReserva.length > 0){
              
              this._futbolService.actualizarReserva(dataFormulario, dataReserva[0].id)
              .then(() => {
                
                loading.present();
                this._futbolService.getSearchEstablecimiento(this.idDocLocal)
                .subscribe((r) => {
                  let nombre = this._futbolService.nombre + ' ' + this._futbolService.apellido;
                  this._noti.obtenerTokenFirebase(r.data().eid)
                  .subscribe(() => {
                    
                    let mensaje = `Se ha realizado una reserva para el día ${ dataFormulario.dia } a las ${ dataFormulario.horaInicio} hasta las ${ dataFormulario.horaFin }... presione la notificacion para ver más`
                    this._noti.enviarNotificacion('Reserva', nombre, this._noti.token, mensaje, dataLocal.idDocLocal, "reservas", "notificacion-p", id)
                    .subscribe((r) => {
                      
                      loading.dismiss();
                      this.resetearFormulario();
                    })
                    
                  });
                
                });

                
              }).catch((errno) => {
                
                
              });
            }else{
              loading.present();
              this._futbolService.getUserByLocalDoc(this.idDocLocal)
              .subscribe(() => {
                let nombre = this._futbolService.nombre + ' ' + this._futbolService.apellido;
                this._futbolService.guardarReserva(this._auth.usuario.uid, dataLocal, dataFormulario, nombre)
                .then(() => {
                  
                  this._futbolService.getSearchEstablecimiento(this.idDocLocal)
                  .subscribe((r) => {

                    this._noti.obtenerTokenFirebase(r.data().eid)
                    .subscribe(() => {
                      let mensaje = `Se ha realizado una reserva para el día ${ dataFormulario.dia } a las ${ dataFormulario.horaInicio} hasta las ${ dataFormulario.horaFin }... presione la notificacion para ver más`
                      this._noti.enviarNotificacion('Reserva', nombre, this._noti.token, mensaje, dataLocal.idDocLocal, "reservas",  "notificacion-p", id)
                      .subscribe((r) => {
                        
                        loading.dismiss();
                        this.resetearFormulario();
                      })
                    })
                  });
                  
                }).catch((errno) => {
                  
                  
                });
              })
            }
            
          });
          
        }else{
          loading.present();
          this._futbolService.getUserByLocalDoc(this.idDocLocal)
          .subscribe(() => {
            let nombre = this._futbolService.nombre + ' ' + this._futbolService.apellido;
            this._futbolService.guardarReserva(this._auth.usuario.uid, dataLocal, dataFormulario, nombre)
            .then(() => {
              
              this._futbolService.getSearchEstablecimiento(this.idDocLocal)
              .subscribe((r) => {
                this._noti.obtenerTokenFirebase(r.data().eid)
                .subscribe(() => {
                  let mensaje = `Se ha realizado una reserva para el día ${ dataFormulario.dia } a las ${ dataFormulario.horaInicio} hasta las ${ dataFormulario.horaFin }... presione la notificacion para ver más`
                  this._noti.enviarNotificacion('Reserva', nombre, this._noti.token, mensaje, dataLocal.idDocLocal, "reservas", "notificacion-p", id)
                  .subscribe((r) => {
                    
                    loading.dismiss();
                    this.resetearFormulario();
                  })
                });
              });
              
            }).catch((errno) => {
              
              
            });
          })
          
          
        }
        
      
      
    }, (errno) => {
      
      return;
    })

    

  }

  resetearFormulario(){
    this.formularioReserva.reset();
    this.horasGenerico.splice(0, this.horasGenerico.length);
    this.horasGenerico.length = 0;
  }

  crearFormulario(){
    this.formularioReserva = this._formBuilder.group({
      diaFecha: ['', Validators.required],
      hora: ['', Validators.required],
      tiempo: ['', Validators.required],
      cantidad: ['', Validators.required],
      observaciones: ['']
    });
  }

  //funcion para cargar el id del documento de la reserva si el usuario y local son el mismo
 

  //funcion para abir la ubicacion
  abrirUbicacion(){
     this.datosLocal.forEach( async (data) => {
      const modal = await this._modalCtrl.create({
        component:UbicacionMapaComponent,
        componentProps:{
          data
        }
      });
      await modal.present();

    });

  }
  //funcion para generar un id aleatorio unico
  generarId(){
    let d = new Date().getTime();
    
    
    let uuid = 'xxxxxyfxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (d + Math.random() * 16 ) % 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  ngOnDestroy(){
    
    this.horasGenerico.splice(0, this.horasGenerico.length);
    this.horasGenerico.length = 0;
    this.resetearFormulario();
  }

  

}
