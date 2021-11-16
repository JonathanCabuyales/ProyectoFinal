import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked, AfterContentInit } from '@angular/core';
import { Horarios, OtrosServicios, Redes, Reservas } from 'src/app/interfaces/interfaces.futbol';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { Observable, combineLatest } from 'rxjs';
import { FutbolInnService } from 'src/app/services/futbol-inn.service';
import { RespUbicaciones } from '../../../interfaces/interfaces.futbol';
import { PopoverController, ViewDidEnter, ModalController } from '@ionic/angular';
import { ServiciosLocalComponent } from '../../components/servicios-local/servicios-local.component';
import { HorariosComponent } from '../../components/horarios/horarios.component';
import { RedesComponent } from '../../components/redes/redes.component';
import { AuthService } from '../../../services/auth.service';
import { UbicacionMapaComponent } from '../../components/ubicacion-mapa/ubicacion-mapa.component';

@Component({
  selector: 'app-informacion-cancha',
  templateUrl: './informacion-cancha.page.html',
  styleUrls: ['./informacion-cancha.page.scss'],
})
export class InformacionCanchaPage implements OnInit, AfterContentInit, OnDestroy {

  informacionData: RespUbicaciones[] = [];
  informacionFavoritos: RespUbicaciones;
  favoritos: boolean = false;

  constructor(
    private _storage: AlmacenamientoService,
    public _futbolService: FutbolInnService,
    private _popoverCtrl: PopoverController,
    private _auth: AuthService,
    private _modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  ngAfterContentInit(){
    this.verificarFavoritos();
    this.getEstablecimientoDoc();
  }


  ionViewDidEnter(){
    this.eliminarHorasLimite();
  }

  ionViewDidLieave(){
   this.eliminarHorasLimite(); 
  }

  getEstablecimientoDoc(){
    this.informacionData = [];
    combineLatest([
      this._storage.getLength(),
      this._storage.getData('idDocLocal')
    ])
    .subscribe(([tamanio, idDocLocal]) => {
      if(tamanio.length > 0){
        
        if(idDocLocal !== null){
          this._futbolService.searchEstablecimiento( idDocLocal )
          .subscribe( data => {
            this.informacionData = [];
            this.informacionData.push(data);
            
            
            this.informacionFavoritos = data;
          });
          
        }
        
      }
    });
  }

  async verServicios(servicios: OtrosServicios, evento: any){
    const popoverServicios = await this._popoverCtrl.create({
      component: ServiciosLocalComponent,
      componentProps:{
        otrosServicios: servicios
      },
      event: evento
    });

    await popoverServicios.present();

  }

  async horarioPopover(horarios: Horarios, evento: any){
    const popoverHorario = await this._popoverCtrl.create({
      component: HorariosComponent,
      componentProps: {
        horarioSemana: horarios
      },
      event: evento
    });

    await popoverHorario.present();

  }

  async verRedes( redes: Redes, evento: any){
    const popoverRedes = await this._popoverCtrl.create({
      component: RedesComponent,
      componentProps: {
        redes
      },
      event: evento
    });

    await popoverRedes.present();
     
  }

  async verUbicacion(info: any){
    const modal = await this._modalCtrl.create({
      component: UbicacionMapaComponent,
      componentProps:{
        data: info
      }
    });

    modal.present();
    
  }

  ngOnDestroy(){
    
    
  }

  verificarFavoritos(){
    this._storage.getData('idDocLocal')
    .then((idDocLocal) => {
      
      
      this._futbolService.varificarFav(idDocLocal)
      .subscribe(() => {
        
        
      });

    }).catch(() =>{})
  }

  guardarFavorito(){
    this._storage.getData('idDocLocal')
    .then((idDocLocal) => {
      combineLatest([
        this._futbolService.varificarFav(idDocLocal),
        this._futbolService.idDocFavoritos(this._auth.usuario.uid)
      ]).subscribe(([]) => {
        if(this._futbolService.favoritosBool){
          
          this._futbolService.borraFavorito(this._futbolService.favoritosIdDoc, idDocLocal)
          .then(() => {
            
            this._futbolService.favoritosBool = false;
          }).catch((errno) => {});
          
        }else{
          
          if(this._futbolService.favoritosIdDoc.length > 0){
            this._futbolService.actualizarFavoritos(this._futbolService.favoritosIdDoc, idDocLocal)
            .then(() => {
              
              this._futbolService.favoritosBool = true;
              
            }).catch((errno) => {
              
              
            });
            
          }else{
            this._futbolService.guardarFavorito(idDocLocal, this._auth.usuario.uid)
            .then(() => {
              
              this._futbolService.favoritosBool = true;
              
            }).catch((errno) => {})

          }
          
        }
      })
    }).catch((errno) => {})
  }
  

  // funcion para eliminar las horas reservadas de los cuando lleguen a limite
  async eliminarHorasLimite(){
    const idDocLocal = await this._storage.getData('idDocLocal');
    
    let tiempoActual = new Date().getTime();
    const reservas = this._futbolService.getHorarioReservas(idDocLocal);
    
    reservas.subscribe((respHoras) => {
      
      

      if(!respHoras.empty){
        for(let f of respHoras.docs){
          
          if(f.exists){
            for(let a of f.data().dataExtra){
              if(a.fechaTime <= tiempoActual){
                let dataExtra ={
                  hora: a.hora,
                  cantidad: a.cantidad,
                  activo: true,
                  diaFecha: a.diaFecha,
                  fechaTime: a.fechaTime
                }
                this._futbolService.eliminarHorario(f.id, dataExtra)
                .then(() =>{
                  
                  
                }).catch((err) =>{

                })
                
                
                
              }else{
                
                
              }
            }
          }
        }
      }

      
      
          
    });
  }



}
