import { Injectable, OnDestroy } from '@angular/core';
//importaciones de firebase para obtener los datos
import { AngularFirestore } from "@angular/fire/firestore";
import { Registro, RespUbicaciones, datosPersonales, Reservas, fotos, horarioReserva } from '../interfaces/interfaces.futbol';
import firebase from "firebase/app";
import { map, take } from "rxjs/operators";
import { fav } from '../interfaces/comentarios.interface';

@Injectable({
  providedIn: 'root'
})
export class FutbolInnService implements OnDestroy {

  datosPersonales: datosPersonales[];
  nombre: string ='';
  apellido: string ='';
  nombrePerfil: string ='';
  apellidoPerfil: string ='';
  idDoUser: string ="";
  tipo: string = '';
  mostrarMenu: boolean = false;
  favoritosIdDoc: string = "";
  favoritosBool: boolean;
  cedulasIguales: boolean = false;
  constructor(
    private _afs: AngularFirestore
  ) {
    this.datosPersonales = [];
    this.favoritosBool = false;
   }


   //funcion para traer el id del documento de reservas
   getIdDocOfReservas(idDocLocal: string, uidUser: string){
     return this._afs.collection('reservas', ref => ref.where('local.idDocLocal', '==', idDocLocal).where('usuario.uidUser', '==', uidUser)).get()
     .pipe(
       map( data => {
        return data.docs.map(a => {
          const idDocReserva:any = a.data();
          const id = a.id;
          return {id, idDocReserva};
        });
       })
     );
   }
   getIdDocOfReservasByLocal(idDocLocal: string){
     return this._afs.collection('reservas', ref => ref.where('local.idDocLocal', '==', idDocLocal)).get()
     .pipe(
       map( data => {
        return data.docs.map(a => {
          const idDocReserva:any = a.data();
          const id = a.id;
          return {id, idDocReserva};
        });
       })
     );
   }

  guardarDatos(registroUsuario: Registro){
    this._afs.collection('registroPerfil').add(registroUsuario);
  }

  getUbicaciones(){
    return this._afs.collection<RespUbicaciones>('ubicaciones').get();
  }

  searchEstablecimiento( idDocUbicaciones: string ){
    return this._afs.collection<RespUbicaciones>('ubicaciones').doc(idDocUbicaciones).valueChanges();
  }

  getUserByIdDoc( idUser: string ){
    
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid' , '==', idUser)).get()
    .pipe(
      map( data => {
        try {
          for(let doc of data.docs){

            this.idDoUser = doc.data().uid;
            this.nombre = doc.data().nombre;
            this.apellido = doc.data().apellido;
            this.datosPersonales = [];
            this.tipo = doc.data().tipo;
            this.datosPersonales.push(doc.data());
          }
          
        } catch (error) {
          
        }
        
      })
    )
  }


  getUserByLocal(idUser: string){
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid', '==', idUser)).get()
    /* .pipe(
      map( data => {
        for(let doc of data){
          this.datosPersonales.push(doc);
        }
        
      })
    ) */
  }
  getUserByLocalDoc(idUser: string){
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid', '==', idUser)).valueChanges();
  }

  getUserByIdDocMenu( idUser: string ){
    return this._afs.collection<datosPersonales>('registroPerfil').doc(idUser).get()
    .pipe(
      map( data => {
          
          this.mostrarMenu = true;
          this.idDoUser = data.id;
          this.nombre = data.data().nombre;
          this.apellido = data.data().apellido;
          this.datosPersonales = [];
          this.tipo = data.data().tipo;
          this.datosPersonales.push(data.data());
        
      })
    )
  }
  getUserByIdDocPerfil( idUser: string ){
    return this._afs.collection<datosPersonales>('registroPerfil', ref => ref.where('uid', '==', idUser)).valueChanges()
    .pipe(
      map( data => {
        data.map( datos  => {

          this.datosPersonales = [];
          this.nombre = datos.nombre;
          this.apellido = datos.apellido;
          this.datosPersonales.push(datos);
        });
      })
    );
  }

  


  guardarReserva(idDocuser:string, dataLocal: any, data: any, nombre: string){
    
    return this._afs.collection('reservas').add({
      dataReserva: firebase.firestore.FieldValue.arrayUnion(data),
      usuario: {
        uidUser: idDocuser,
        nombreUser: nombre
      },
      local: dataLocal,
      activo: true,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  horarioReservas(dataExtra: any,dataLocal: any){
    return this._afs.collection('horarioReservas').add({
      dataExtra: firebase.firestore.FieldValue.arrayUnion(dataExtra),
      local: dataLocal,
      activo: true,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  actualizarHorarioReservas(idDocHorario: string, dataExtra: any){
    return this._afs.collection('horarioReservas').doc(idDocHorario).update({
      dataExtra: firebase.firestore.FieldValue.arrayUnion(dataExtra),
    });
  }
  getHorarioReservas(idDocLocal: string){
    return this._afs.collection<horarioReserva>('horarioReservas', ref => ref.where('local.idDocLocal', '==', idDocLocal)).get();
  }
  
  eliminarHorario(idDocHorario: string, dataExtraEliminar: any){

    return this._afs.collection('horarioReservas').doc(idDocHorario).update({
      dataExtra: firebase.firestore.FieldValue.arrayRemove(dataExtraEliminar),
    });
  }
  
  

  actualizarReserva(data:any , idDocReserva: string){
    return this._afs.collection('reservas').doc(idDocReserva)
    .update({
      dataReserva: firebase.firestore.FieldValue.arrayUnion(data),
    });
  }
  
  eliminarDataExtra(idDocReserva: string, dataExtra: any){
    return this._afs.collection('reservas').doc(idDocReserva).update({
      dataExtra: firebase.firestore.FieldValue.arrayRemove(dataExtra)
    });

  }

  //funcion para verificar si el documento de reserva existe
  getDocReserva(idLocal: string){
    return this._afs.collection<Reservas>('reservas', ref => ref.where('local.idDocLocal', '==', idLocal)).valueChanges();
  }

  //funcion para obtener la cantidad de cantas disponibles quedan
  actualizarCanchas(disponibles: number, idDocLocal: string){
    return this._afs.collection('ubicaciones').doc(idDocLocal).update({
      numCanchas: disponibles
    });
  }

  getReservasByFecha(fecha: string, idLocal: string){
    return this._afs.collection<Reservas>('reservas', ref => ref.where('local.idDocLocal', '==', idLocal)).snapshotChanges();
  }

  getReservasByUser(idDocUser: string){
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser)).valueChanges();
  }
  getReservasByUserNotificaciones(idDocUser: string){
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser)).get();
  }

  cambiarActivo(uidLocal: string, uidUser: string){
    return this._afs.collection<Reservas>('reservas', ref=> ref.where('local.idDocLocal', '==', uidLocal).where('usuario.uidUser','==', uidUser)).valueChanges();
  }
  getReservasByUserLocal(idDocUser: string){
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser)).get();
  }
  getReservasByUserLocalNoti(idDocUser: string){
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser)).get();
  }
  getReservasId(idDocUser: string, uidLocal: string){
    
    return this._afs.collection<Reservas>('reservas', ref => ref.where('usuario.uidUser', '==', idDocUser).where('local.idDocLocal', '==' , uidLocal)).get();
  }
  

  getSearchEstablecimiento( idDoc: string ){
    return this._afs.collection<RespUbicaciones>('ubicaciones').doc(idDoc).get();
  }

  actualizarUser(docId: string, data: any){
    return this._afs.collection('registroPerfil').doc(docId).update(data);
  }


  guardarFavorito(uidLocal: any, idUser: string){
    return this._afs.collection('favoritos').add({
      idUser,
      favoritos: firebase.firestore.FieldValue.arrayUnion(uidLocal),
      fav: true
    });
  }

  idDocFavoritos(uidUser: string){
    return this._afs.collection('favoritos', ref => ref.where('idUser', '==', uidUser)).get()
    .pipe(
      map(id => {
        for(let docId of id.docs){

          this.favoritosIdDoc = docId.id;
        }
      })
    );
  }

  varificarFav(idDocLocal: string){
    return this._afs.collection<fav>('favoritos', ref => ref.where('favoritos','array-contains', idDocLocal)).get()
    .pipe(
      map(id => {
        
        if(id.docs.length > 0){
          
          id.docs.map(idDoc => {
            idDoc.data().favoritos.map(fav => {
              if(fav === idDocLocal){
                this.favoritosBool = true
              }
            });
          });
          
        }else{
          
          this.favoritosBool = false;
          
        }
        
      })
    )
  }
  

  actualizarFavoritos(idDoc: string, idDocLocal: string){
    return this._afs.collection('favoritos').doc(idDoc).update({
      favoritos: firebase.firestore.FieldValue.arrayUnion(idDocLocal)
    });
  }


  borraFavorito(idDoc: string, idDocLocal: string){
    return this._afs.collection('favoritos').doc(idDoc).update({
      favoritos: firebase.firestore.FieldValue.arrayRemove(idDocLocal)
    });
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

  obtenerResevaByid(idReserva: string){
    return this._afs.collection('reservas', ref => ref.where('dataReserva.id', 'array-contains-any', idReserva)).valueChanges();
  }

  //funcion para obtener favoritos
  obtenerFavoritos(uidUser: string){
    return this._afs.collection<fav>('favoritos', ref => ref.where('idUser', '==', uidUser)).get()
    .pipe(
      map(resp => {
        return resp.docs.map(a => {
          return {data: a.data().favoritos}
        });
      })
    );
  }

  //funcion para verificar cedula
  getCedula(cedula: string){
    return this._afs.collection<Registro>('registroPerfil').get();
  }

  /* obtenerFavoritos() */


  ngOnDestroy(){
    this.datosPersonales = [];
    this.favoritosBool = false;
  }

}
