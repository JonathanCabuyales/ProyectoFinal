import { Component, Input, OnInit } from '@angular/core';
import { Horarios } from '../../../interfaces/interfaces.futbol';
import { ModalController, ToastController } from '@ionic/angular';
import { PropietarioSService } from '../../../services/propietario-s.service';

@Component({
  selector: 'app-modificar-horarios',
  templateUrl: './modificar-horarios.page.html',
  styleUrls: ['./modificar-horarios.page.scss'],
})
export class ModificarHorariosPage implements OnInit {

  @Input() horarios: Horarios;
  @Input() eidLocal: string;

  constructor(
    private _modalCtrl: ModalController,
    private _propService: PropietarioSService,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {
    
    
  }
  cerrarModal(){
    this._modalCtrl.dismiss();
  }

  async guardar(semanaData: any, finSemanaData:any){
    
    let semanaHora:string = semanaData.value;
    let finSemanaHora:string = finSemanaData.value;
    
    
    const toast = await this._toastCtrl.create({
      message: 'se ha actualizado el horario correctamente',
      duration: 2000,
      buttons: [
        {
          text: 'Aceptar',
          icon: 'checkmark-outline',
          role: 'aceptar',
          side: 'start'
        }
      ]
    });
    let tiempoMostrar = {
      finSemana: [finSemanaHora.slice(0,5), finSemanaHora.slice(8,13)],
      semana: [semanaHora.slice(0,5), semanaHora.slice(8,13)]
    }
    let dataHorario = {
      horarios:{
        finSemana:{
          dias: this.horarios.finSemana.dias,
          hora: finSemanaData.value
        },
        semana: {
          dias: this.horarios.semana.dias,
          hora: semanaData.value
        }
      },
      tiempoMostrar
    }
    
    
    

      this._propService.getIdDocOfUbicaciones(this.eidLocal)
      .subscribe(() => {
        this._propService.actualziarHorario(this._propService.idDocReserva, dataHorario)
        .then( () => {
          toast.present();
          
          
        });
      });
    

  }
  cancelar(){
    this._modalCtrl.dismiss();
  }

}
