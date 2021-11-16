import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { AuthService } from '../../../services/auth.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { Horarios, OtrosServicios, Redes } from '../../../interfaces/interfaces.futbol';
import { ModalController, MenuController } from '@ionic/angular';
import { ModificarDatosPage } from '../modificar-datos/modificar-datos.page';
import { ModificarHorariosPage } from '../modificar-horarios/modificar-horarios.page';
import { ModificarRedesPage } from '../modificar-redes/modificar-redes.page';
import { ModificarTelfPage } from '../modificar-telf/modificar-telf.page';
import { ModificarServPage } from '../modificar-serv/modificar-serv.page';
import { AgregarImagenesPage } from '../agregar-imagenes/agregar-imagenes.page';

@Component({
  selector: 'app-informacion-cancha',
  templateUrl: './informacion-cancha.page.html',
  styleUrls: ['./informacion-cancha.page.scss'],
})
export class InformacionCanchaPage implements OnInit, OnDestroy {
  
  
  constructor(
    public _propService: PropietarioSService,
    private _auth: AuthService,
    private _modalCtrl: ModalController,
    private _menu: MenuController
  ) { }

  ngOnInit() {
    
  }

  /* ionViewWillEnter(): void {
    this._menu.enable(false);
  }
  
  ionViewWillLeave(): void {
    this._menu.enable(true);
  } */


  /* getEstablecimiento(){
    
        this._propService.getEstablecimiento(this._auth.usuario.uid)
        .subscribe();
      
  } */

  abrirMenu(){
    this._menu.enable(true,'propietario');
    this._menu.open('propietario');
    
  }


  async modificarData(dataModificar: string, dataValue: any, idLocal: string){
    const modal = await this._modalCtrl.create({
      component: ModificarDatosPage,
      componentProps: {
        campoEditar: dataModificar,
        campoValor: dataValue,
        eidLocal: idLocal
      }
    });

    await modal.present();
  }

  async modificarHorarios(horarios: Horarios, eidLocal: string){
    
    const modal = await this._modalCtrl.create({
      component: ModificarHorariosPage,
      componentProps: {
        horarios: horarios,
        eidLocal
      }
    });
    await modal.present();
  }
  //funcion para agregar o modificar las redes
  async modificarRedes(redes: Redes, eid: string){
    
    
    const modalRedes = await this._modalCtrl.create({
      component: ModificarRedesPage,
      componentProps:{
        redes,
        eid
      }
    });

    await modalRedes.present();
  }

  async modificarTelf(telf:any, eid: string){
    
    const modalTelf = await this._modalCtrl.create({
      component: ModificarTelfPage,
      componentProps:{
        telfs: telf,
        eid
      }
    });
    await modalTelf.present();
  }

  async modificarServ(servicios: OtrosServicios, eid: string){
    
    const modalServ = await  this._modalCtrl.create({
      component: ModificarServPage,
      componentProps:{
        servicios,
        eid
      }
    });
    await modalServ.present();
  }

  //funcion par agregar imagenes
  async agregarImagenes(){
    const modal = await this._modalCtrl.create({
      component: AgregarImagenesPage,
      componentProps:{
        local: this._propService.establecimiento[0]
      }
    });
    await modal.present();
  }

  ngOnDestroy(){
    
  }

}
