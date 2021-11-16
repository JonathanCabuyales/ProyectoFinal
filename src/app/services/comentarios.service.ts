import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { DefaultValueAccessor } from '@angular/forms';
import * as firebase from "firebase/app";
import { map, take } from "rxjs/operators";
import { comentariosInterface } from '../interfaces/comentarios.interface';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  comentariosArr: any[]= [];
  idDocComentarios: string = '';
  userId: string = "";
  modificarComentario: comentariosInterface = {
    comentarios: {
      comentUser: {
        comentario: '',
        fecha: '',
        hora: '',
        valorCalificacion: 0,
        id: ''
      },
      comentResp: {
        resp: false
      }
    },
    dataInfo: {
      nomLocal: '',
      nomUser: '',
      uidLocal: '',
      uidUser: ''
    }
  };
  constructor(
    private _http: HttpClient,
    private _afs: AngularFirestore
  ) { }

  getComentariosEstablecimiento(uidLocal: string){

    return this._afs.collection<comentariosInterface>('comentarios', ref => ref.where('dataInfo.uidLocal', '==', uidLocal)).valueChanges()
    .pipe(
      map( data => {
        this.comentariosArr = [];
        for(let doc of data){
          this.userId = doc.dataInfo.uidUser;
          this.comentariosArr.push(doc)
        }
      })
    )
    
  }

  getComentariosEstablecimientoGet(uidLocal: string){

    return this._afs.collection('comentarios', ref => ref.where('dataInfo.uidLocal', '==', uidLocal)).get()
    .pipe(
      map( data => {
        this.comentariosArr = [];
        for(let doc of data.docs){
          this.idDocComentarios = doc.id;

          //this.comentariosArr.push(doc.data());
        }
      })
    )
    
  }
  editComentarioEstablecimiento(uidLocal: string, uidUser: string){

    return this._afs.collection('comentarios', ref => ref.where('dataInfo.uidLocal', '==', uidLocal). where('dataInfo.uidUser', '==', uidUser)).valueChanges()
    .pipe(
      map( (data: comentariosInterface[]) => {
        for(let doc of data){
          this.modificarComentario.dataInfo = doc.dataInfo;
          this.modificarComentario.comentarios = doc.comentarios;
        }
      })
    )
    
  }

  getIdDocComentario(uidLocal: string, uidUser: string){
    return this._afs.collection('comentarios', ref => ref.where('dataInfo.uidLocal', '==', uidLocal). where('dataInfo.uidUser', '==', uidUser)).get()
    .pipe(
      take(1),
      map( idDoc => {
        for( let doc of idDoc.docs){
          this.idDocComentarios = doc.id;
        }
      })
    )
  }

  actualizarComentario(data: any, idDoc: string){
    return this._afs.collection('comentarios').doc(idDoc).update({
      comentarios: {
        comentUser: data,
        comentResp: {
          resp: false
        }
      },
    });
  }

  actualizarComentarioLocal(dataUser: any, idDoc: string, dataLocal: any){
    return this._afs.collection('comentarios').doc(idDoc).update({
      comentarios:{
        comentUser: dataUser,
        comentResp: dataLocal
      }
    });
  }

  guardarComentario(dataInfo: any, comentario: any){
    return this._afs.collection('comentarios').add({
      dataInfo,
      comentarios: {
        comentUser: comentario,
        comentResp:{
          resp: false
        }
      }
    });
  }

  getAllComentariosUser(uidUser: string){
    return this._afs.collection('comentarios', ref => ref.where('dataInfo.uidUser', '==', uidUser)).valueChanges()
    .pipe(
      map( (data: comentariosInterface[]) => {
        this.comentariosArr = [];
        for(let doc of data){
          this.comentariosArr.push(doc);
        }
      })
    )
    
  }

  //funcion para agregar respuesta al comentario
  agregarRespuestaComentario(idDocComentario: string, idComentario: string, comentario: string, comentariosNormal: comentariosInterface ){
    let fecha = new Date();
    return this._afs.collection('comentarios').doc(idDocComentario).update({
      comentarios: {
        comentResp: {
          resp: true,
          fecha: fecha.getFullYear()+"-"+(fecha.getMonth()+1)+"-"+fecha.getDate(),
          hora: fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(),
          id: idComentario,
          comentario: comentario
        },
        comentUser: comentariosNormal.comentarios.comentUser,
      }
    })
  }
}
