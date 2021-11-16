import { Injectable, OnDestroy } from '@angular/core';

//importaciones de firebase para obtener los datos
import { AngularFirestore } from "@angular/fire/firestore";
import { Registro, RespUbicaciones, datosPersonales, Reservas, Redes, OtrosServicios } from '../interfaces/interfaces.futbol';
import firebase from "firebase/app";
import { map, take } from "rxjs/operators";
import { FutbolInnService } from './futbol-inn.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PropietarioSService implements OnDestroy {

  public idDocReserva: string = "";
  establecimiento: RespUbicaciones[] = [];
  reservasLocal: any[] = [];
  totalReservas: number = 0;
  existReserva: boolean;
  contadorSi: number = 0;
  contadorNo: number = 0;
  nombreLocal: string = "";

  datosPersonales: any[] = [];
  


  constructor(
    private _afs: AngularFirestore,
    private _futbol: FutbolInnService
  ) { }

  getIdDocOfUbicaciones( uidLocal: string){
    return this._afs.collection<RespUbicaciones>('ubicaciones', ref => ref.where('eid', '==' , uidLocal)).get()
    .pipe(
      map( respMap => {
        for(let doc of respMap.docs){
          this.idDocReserva = doc.id;
          this.nombreLocal = doc.data().nomLocal;
        }
      })
    );
  }

  getUbicaciones(eid: string){
    return this._afs.collection<RespUbicaciones>('ubicaciones', ref => ref.where('eid', '==', eid)).get();
  }

  getReservasLocal(idDocReserva: string){
    return this._afs.collection<Reservas>('reservas', ref => ref.where('local.idDocLocal', '==', idDocReserva)).get()
    
  }

  getReservasId(idDocUser: string, uidLocal: string){
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser).where('local.idDocLocal', '==' , uidLocal)).get();
  }

  getReservasByUser( fecha:string, idDocReserva: string ){
    
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('local.idDocLocal', '==', idDocReserva)).valueChanges()
    .pipe(
      map( data => {
        data.filter( doc => {
          this._futbol.getUserByIdDocMenu(doc.usuario.uidUser)
          .subscribe( () => {
            doc.dataReserva.filter( (docFecha) => {
              
              
              
              if(docFecha.activo === true && fecha === docFecha.fechaReserva && this._futbol.idDoUser === doc.usuario.uidUser && docFecha.cancelacion.cancelado === false){
                
                
                
                this.reservasLocal = [];
                this.reservasLocal.push({data: [docFecha], nombreUser: this._futbol.nombre})
                
              }
              
            });
          }, (errno) => {});
        });
      })
    );
  }

  //funcion para actualizar si se ha cancelado la reserva
  removerReserva(idDocReservaCancelar: string, dataActualizar: any){
    return this._afs.collection('reservas').doc(idDocReservaCancelar).update({
      dataReserva: firebase.firestore.FieldValue.arrayRemove(dataActualizar)
    });
  }

  actualizarReserva(idDocReservaCancelar: string,dataActualizar: any){
    return this._afs.collection('reservas').doc(idDocReservaCancelar).set({
      dataReserva: firebase.firestore.FieldValue.arrayUnion(dataActualizar)
    }, {merge: true});
  }

  borrarReserva(idReserva: string, data:any){
    return this._afs.collection('reservas').doc(idReserva).update({
      dataReserva: firebase.firestore.FieldValue.arrayRemove(data)
    });
  }
  actualizarReservaIndividual(idDocReserva: string, data:any){
    return this._afs.collection('reservas').doc(idDocReserva).set({
      dataReserva: firebase.firestore.FieldValue.arrayUnion(data)
    }, {merge: true});
  }

  getEstablecimiento(uidUserProp: string){
    return this._afs.collection<RespUbicaciones>('ubicaciones', ref => ref.where('eid', '==', uidUserProp)).valueChanges()
    .pipe(
      map((resp) => {
        this.establecimiento = [];
        for(let doc of resp){
          this.establecimiento.push(doc);
          
          
        }
      })
    )
  }

  

  getUserByIdDocPerfil( idUser: string ){
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid', '==', idUser)).valueChanges()
    .pipe(
      map( data => {
        data.map( datos  => {

          this.datosPersonales = [];
          this.datosPersonales.push(datos);
        });
      })
    );
  }

  //funcion para actualizar los datos del establecimiento
  actualizarDataLocal(dataActualizar: any, idDocUbicaciones: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicaciones).update(dataActualizar);
  }

  //funcion para actualizar el horario
  actualziarHorario(idDocUbicaciones: string, dataActualizar: any){
    return this._afs.collection('ubicaciones').doc(idDocUbicaciones).update(dataActualizar)
    
  }

  actualizarRedes(redes: any, idDocUbicacion: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicacion).update({
      redes
    });
  }
  borrarRedes(redes: any, idDocUbicacion: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicacion).update({
      redes
    });
  }

  agregarRedes(dataRedes: any, idDocUbicaciones: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicaciones).update({
      dataRedes
    });
  }

  //funcion para actualizar los servicios
  actualizarServicios(servicios: OtrosServicios, idDocUbicacion: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicacion).update({
      otrosServicios: servicios
    })
  }

  //funcion para actualizar los tel
  actualizarTelfs(dataTelf:any, idDocUbicacion: string){
    return this._afs.collection('ubicaciones').doc(idDocUbicacion).update({
      telf: dataTelf
    });
  }

  //funcion para obtener la reserva por el id de la reserva
  reservaById(idReservaLocal: string){
    return this._afs.collection<Reservas>('reservas', ref => ref.where('local.idDocLocal', '==', idReservaLocal)).valueChanges()
  }

  ngOnDestroy(){
    this.reservasLocal = [];
  }

  
}
