import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';
import { Registro } from '../interfaces/interfaces.futbol';
import { AngularFireStorage } from "@angular/fire/storage";
import firebase from 'firebase/app';
import { fotosSubir } from '../interfaces/fotos.interface';

@Injectable({
  providedIn: 'root'
})
export class FotosService {
  idDocUser: string = "";
  foto: string = "";
  constructor(
    private _afs: AngularFirestore,
    private _storage: AngularFireStorage
  ) { }


  obtenerIdDoc(uid: string){
    return this._afs.collection('registroPerfil', ref => ref.where('uid', '==', uid)).get()
    .pipe(
      map(a => {
        for(let id of a.docs){
          this.idDocUser = id.id;
        }
      })
    );
  }

  guardarUrl(urlFoto: string, idDoc: string){
    let datafoto ={
      url: urlFoto,
      fecha: new Date().getTime()
    }
    return this._afs.collection('registroPerfil').doc(idDoc).update({
      foto: firebase.firestore.FieldValue.arrayUnion(datafoto)
    });
  }
  guardarUrlUbicaciones(urlFoto: string, idDoc: string){
    let datafoto ={
      url: urlFoto,
      fecha: new Date().getTime()
    }
    return this._afs.collection('ubicaciones').doc(idDoc).update({
      foto: firebase.firestore.FieldValue.arrayUnion(datafoto)
    });
  }

  /* leerFoto(idDoc: string){
    return this._afs.collection<Registro>('registroPerfil').doc(idDoc).valueChanges()
    .pipe(
      map(a => {
        this.foto = a.foto;
      })
    );
  } */


  async cargarImagenesFirebase(imagenes: fotosSubir[], nombreUser: string){
    let response: any, blob: any ,ref: any, task: any;
    for(let img of imagenes){
      response = await fetch(img.webPath);
      blob = await response.blob();
      ref = this._storage.ref(`img/${ nombreUser }/${ img.nombre }`);
      task = ref.put(blob);
      return task;
    }
    
  }
  async cargarImagenesLocalFirebase(imagenes: fotosSubir[], nombreUser: string){
    
    let response: any, blob: any ,ref: any, task: any;
    let urlFotos: any[] = [];
    for(let img=0; img< imagenes.length; img++){
      response = await fetch(imagenes[img].webPath);
      blob = await response.blob();
      ref = this._storage.ref(`img/${ nombreUser }/${ imagenes[img].nombre }`);
      task = ref.put(blob);
      urlFotos.push(task)
    }
    return urlFotos;
    
  }
}
