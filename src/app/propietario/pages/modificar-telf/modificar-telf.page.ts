import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropietarioSService } from '../../../services/propietario-s.service';

@Component({
  selector: 'app-modificar-telf',
  templateUrl: './modificar-telf.page.html',
  styleUrls: ['./modificar-telf.page.scss'],
})
export class ModificarTelfPage implements OnInit {
  @Input() telfs: any;
  @Input() eid: any;

  constructor(
    private _modalCtrl: ModalController,
    private _propService: PropietarioSService

  ) { }

  ngOnInit() {
    
    
  }

  cerraModal(){
    this._modalCtrl.dismiss();
  }

  guardar(idCelular: any, idConvencional: any){
    
    

    let dataTelf= {
      celular: idCelular.value,
      convencional: idConvencional.value
    }

    this._propService.getIdDocOfUbicaciones(this.eid)
    .subscribe(() =>{
      this._propService.actualizarTelfs(dataTelf, this._propService.idDocReserva)
      .then( () => {
        
        
      })
    })


    
  }

  cancelar(){

  }

}
