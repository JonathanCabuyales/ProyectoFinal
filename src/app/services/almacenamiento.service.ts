import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RespUbicaciones } from '../interfaces/interfaces.futbol';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService
{

  private _storage: Storage | null = null;
  establecimientosFAavoritos: RespUbicaciones[] = [];
  
  

  constructor(
    private storage: Storage
  ) { 
    this.init();
    this.cargarFavoritos();
  }

  async init(){
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any){
    await this._storage?.set(key, value);
  }

  public getData(key:string){
    return this._storage?.get( key );
  }

  getLength(){
    return this._storage.keys();
  }

  async limpiarKey( key: any){
    return await this._storage.remove( key );
  }

  async guardarFavoritos( dataEstablecimiento: RespUbicaciones, idUser: string ){
    const existe = this.establecimientosFAavoritos.find( local => local.nomLocal === dataEstablecimiento.nomLocal);
    if(!existe){
      
      this.establecimientosFAavoritos.unshift( dataEstablecimiento );
      await this._storage.set('LocalFav', this.establecimientosFAavoritos);
      await this._storage.set('idUserFav', idUser);
    }
  }

  async cargarFavoritos(){
    const favoritos = await this.storage.get('LocalFav');
    
    
    if( favoritos ){
      
      this.establecimientosFAavoritos = favoritos;
    }

    /* return this.establecimientosFAavoritos; */
    
  }
  
  async borrarFavorito( dataEstablecimiento: RespUbicaciones, idUser: string ){
    this.establecimientosFAavoritos = this.establecimientosFAavoritos.filter( m => m.nomLocal !== dataEstablecimiento.nomLocal);
    
    await this._storage.set('LocalFav', this.establecimientosFAavoritos);
    await this._storage.set('idUserFav', idUser);

    this.cargarFavoritos();
  }
}
