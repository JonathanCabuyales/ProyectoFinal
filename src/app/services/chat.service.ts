import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Chat, mensajes, dataMensaje } from '../interfaces/chat.interface';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { FutbolInnService } from './futbol-inn.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatCollection: AngularFirestoreCollection<Chat> | undefined;
  public chats: any[] = [];
  public ultimos: any[] = [];

  constructor(
    private _afs: AngularFirestore,
    private _futbol: FutbolInnService
  ) { 
  }

  addChats( enviarFrom: string, enviarTo: string, mensaje: string, nombreTo: string, nombreFrom: string){
    
    let msj = {
      fecha: new Date().getTime(),
      hora: moment().format('HH:mm:ss'),
      from: enviarFrom,
      mensaje: mensaje
    }
    let chatData ={
      activo: true,
      created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
      to:enviarTo,
      from: enviarFrom,
      nombreTo: nombreTo,
      nombreFrom: nombreFrom,
      mensajes: firebase.default.firestore.FieldValue.arrayUnion(msj)
    }

    return this.chatCollection.add(chatData);

    
  }

  getAllMensajes(to:string, from: string){
    this.chatCollection = this._afs.collection('chats', ref => ref.where('to', '==', to).where('from', '==', from));
    return this.chatCollection.valueChanges()
    .pipe(map((mensajes: Chat[]) => {
      
      this.chats = [];
      for(let msm of mensajes){
        this.chats.push(msm.mensajes);
      }
      
    }));
  }
  getAllMensajesLocal(to:string, from: string){
    this.chatCollection = this._afs.collection('chats', ref => ref.where('to', '==', to).where('from', '==', from));
    return this.chatCollection.valueChanges();
  }

  getIdOfDocumentMensaje(to: string, from: string){
    return this._afs.collection<Chat>('chats', ref=> ref.where('to', '==', to).where('from', '==', from)).get()
    /* .pipe(
      map( chat => {
        chat.map(a => {
          const id = a.payload.doc.id;
          return [id];
        });
      })
    ); */
  }
  actualizarMensajes(idDoc: string, enviarFrom: string, mensaje: string){
    let msj = {
      fecha: new Date().getTime(),
      hora: moment().format('HH:mm:ss'),
      from: enviarFrom,
      mensaje: mensaje
    }
    return this._afs.collection<Chat>('chats').doc(idDoc).update(
      {mensajes: firebase.default.firestore.FieldValue.arrayUnion(msj)}
    )
  }

  //funcion para traer todos los mensajes de un usuario en especifico
  getChatsByUser(from: string){
    return this._afs.collection<Chat>('chats', ref => ref.where('from', '==', from)).get();
    
  }
  getChatsByUserFoto(from: string){
    return this._afs.collection<Chat>('chats', ref => ref.where('from', '==', from)).valueChanges();
    
  }

  getChatOfLocal(to: string){
    return this._afs.collection<Chat>('chats', ref => ref.where('to', '==', to)).get();
  }
}
