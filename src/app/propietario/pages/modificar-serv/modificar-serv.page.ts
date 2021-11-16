import { Component, Input, OnInit } from '@angular/core';
import { OtrosServicios } from '../../../interfaces/interfaces.futbol';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PropietarioSService } from '../../../services/propietario-s.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-modificar-serv',
  templateUrl: './modificar-serv.page.html',
  styleUrls: ['./modificar-serv.page.scss'],
})
export class ModificarServPage implements OnInit {

  @Input() servicios: OtrosServicios;
  @Input() eid: string;
  forma: FormGroup;
  


  constructor(
    private _modalCtrl: ModalController,
    private _fb: FormBuilder,
    private _propService: PropietarioSService,
    private _storage: AlmacenamientoService,
    private _auth: AuthService
  )
  {
    this.crearFormulario();
  }

  get formArrayServicios(){
    return this.forma.get('pasatiempos') as FormArray;
  }
  crearFormulario(){
    this.forma = this._fb.group({
      pasatiempos: this._fb.array([])
    })
  }

  ngOnInit() {
    
    
  }

  agregarServicio(){
    this.formArrayServicios.push( this._fb.control('') );
  }

  obtenerServicios(){
    
      this._propService.getEstablecimiento(this._auth.usuario.uid)
      .subscribe(() => {
        for(let reserva of this._propService.establecimiento){
          this.servicios = reserva.otrosServicios;
        }
      });
  }

  guardarervicio(form: FormGroup){
    let dataServicios: any;
    dataServicios = {
      resp: "si",
      verificacion: true,
      servicios:[...this.servicios.servicios, ...form.value.pasatiempos]
    }
    
    this._propService.getIdDocOfUbicaciones(this.eid)
    .subscribe( () => {
      
      
      this._propService.actualizarServicios(dataServicios, this._propService.idDocReserva)
      .then( () => {
        
        this.obtenerServicios();
        this.formArrayServicios.clear();
        
      });
    });
  }

  cerrarModal(){
    this._modalCtrl.dismiss()
  }

  borrarServicio(serv: any){
    let p: any = this.servicios.servicios.filter( servicios => servicios !== serv);
    let dataServicios = {
      resp: "si",
      verificacion: true,
      servicios: p
    }
    
    
    
      this._propService.getIdDocOfUbicaciones(this._auth.usuario.uid)
      .subscribe(() => {
        
        
        this._propService.actualizarServicios(dataServicios, this._propService.idDocReserva)
        .then(() => {
          
          this.obtenerServicios();
          
        });
      });
    
    
    
    
  }


  eliminarCampo(form: any ){
    this.formArrayServicios.controls.forEach( (r, index) => {
      if(index === form){
        this.formArrayServicios.controls.splice(index, 1);
      }
    });
  }

}
