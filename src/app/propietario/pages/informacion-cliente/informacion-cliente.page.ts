import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { map } from 'rxjs/operators';
import { FutbolInnService } from '../../../services/futbol-inn.service';

@Component({
  selector: 'app-informacion-cliente',
  templateUrl: './informacion-cliente.page.html',
  styleUrls: ['./informacion-cliente.page.scss'],
})
export class InformacionClientePage implements OnInit, AfterViewInit {

  @Input() idReserva: string = "";
  @Input() idDocLocal: string = "";

  reservas: any = [];

  constructor(
    private _modalCtrl: ModalController,
    private _prop: PropietarioSService,
    private _futbol: FutbolInnService
  ) { }

  ngOnInit() {
    
    
  }

  ngAfterViewInit(){
    this.getReservas();
  }

  getReservas(){
    this._prop.reservaById(this.idDocLocal)
    .subscribe((respDataLocal) => {
      

      for(let datos of respDataLocal){
        this._futbol.getUserByIdDocPerfil(datos.usuario.uidUser)
        .subscribe(() => {
          for(let id of datos.dataReserva){
            if(id.id == this.idReserva){
              this.reservas = [{data: id, datosUser: this._futbol.datosPersonales}];
              
              return this.reservas;
            }
          }
          
        }, (errno) => {})
      }
      
    }, (errno) => {})
  }

  cerraModal(){
    this._modalCtrl.dismiss();
  }

}
