import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

import { PropietarioSService } from '../../../services/propietario-s.service';
import { ComentariosService } from '../../../services/comentarios.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { PopoverController, MenuController, ModalController } from '@ionic/angular';
import { EditComentComponent } from '../../../clientes/components/edit-coment/edit-coment.component';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ResponderComentariosPage } from '../responder-comentarios/responder-comentarios.page';


@Component({
  selector: 'app-comentarios-prop',
  templateUrl: './comentarios-prop.page.html',
  styleUrls: ['./comentarios-prop.page.scss'],
})
export class ComentariosPropPage implements OnInit {

  formComentario: FormGroup;
  respBoolean = false;
  uidDocComen: String = "";
  fotos: any =[];
  id: number=0;
  abrirSearch: boolean = false;
  nombreLocalSearch: string ="";
  constructor(
    private _auth: AuthService,
    public _prop: PropietarioSService,
    public _comen: ComentariosService,
    private _fb: FormBuilder,
    private _popover: PopoverController,
    private _futbol: FutbolInnService,
    private _menu: MenuController,
    private _modal: ModalController
  ) { 
    this.crearFormulario();
  }

  ngOnInit() {
    this.getIdDocOfComentarios();
    this.getComentarios();
  }

  abrirMenu(){
    this._menu.enable(true, 'propietario');
    this._menu.open('propietario');
    
  }
  
  getComentarios(){
    this._prop.getIdDocOfUbicaciones(this._auth.usuario.uid)
    .subscribe(() => {
      
      this._comen.getComentariosEstablecimiento(this._prop.idDocReserva)
      .subscribe(() => {
        
        this.cargarFoto(this._comen.userId);
      }, (errno) => {})
    }, (errno) => {});
  }

  //funcion para agregar respuesta al comentario
  async agregarRespuesta(comentarios: any){
    
    
    const modal = await this._modal.create({
      component: ResponderComentariosPage,
      componentProps: {
        comentario: comentarios
      }
    });
    await modal.present();
    
  }

  cargarFoto(userId: string){
    this._futbol.getUserByLocalDoc(userId)
    .subscribe((r) =>{
      for(let i of r){

        this.fotos = i.foto;
      }
    }, (err) =>{

    })
  }

  crearFormulario(){
    this.formComentario = this._fb.group({
      comentariosArray: this._fb.array([])
    })
  }

  get formArrayComentarios():FormArray{
    return this.formComentario.get('comentariosArray') as FormArray;
  }

  agregarComentario(formulario: FormGroup, uidUser: string, uidLocal: string, comentUser: any){
    
    
    let comentResp = {
        resp: true,
        comentario: formulario.value.comentariosArray[0],
        fecha: moment().format("YYYY-MM-DD"),
        hora: moment().format('HH:mm:ss')
      }
    this._comen.getIdDocComentario(uidLocal, uidUser)
    .subscribe(() => {
      
      this._comen.actualizarComentarioLocal(comentUser, this._comen.idDocComentarios, comentResp)
      .then(() => {
        
        
      }).catch(() => {});
    }, (errno) => {});
      
    
    
    
  }

  getIdDocOfComentarios(){
    this._prop.getIdDocOfUbicaciones(this._auth.usuario.uid)
    .subscribe(() => {
      
      this._comen.getComentariosEstablecimientoGet(this._prop.idDocReserva)
      .subscribe(() => {
        
        
      }, (errno) => {})
    }, (errno) => {});
  }

  async abrirEditcoment(evento: any ,uidLocal: string, uidUser: string){
    
    
    await this._popover.create({
      component: EditComentComponent,
      event: evento,
      componentProps: {
        uidLocal,
        uidUser,
        modificarLocal: true
      }
    }).then((resp) => {
      resp.present();
      
    });
    
  }

  cancelar(indexForm: any){
    this.formArrayComentarios.controls.filter((r, index) => {
      if(index === indexForm){
        this.formArrayComentarios.controls.splice(index, 1)
      }
    });
    this.respBoolean = false;
  }
  onSearchChange(evento: any){
    let buscar: string = evento.target?.value;

    if(buscar.trim().length === 0){
      this.getComentarios();
    }else{
      this._comen.comentariosArr= this._comen.comentariosArr.filter(a => {
        return a.dataInfo.nomUser.toLowerCase().includes(buscar.trim().toLowerCase());
      });

    }
    
  }

  search(){
    this.abrirSearch = !this.abrirSearch;
    this.nombreLocalSearch = "";
  }
  cancelado(){
    this.nombreLocalSearch = "";
    this.getComentarios();
  }
  limpiar(){
    this.nombreLocalSearch = "";
    this.getComentarios();
    
  }
  limpiarTexto(){
    this.nombreLocalSearch = "";
    
  }

  

}
