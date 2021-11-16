import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { combineLatest } from 'rxjs';
import { RespUbicaciones } from '../../../interfaces/interfaces.futbol';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AuthService } from '../../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit,AfterViewInit {

  favoritos: any[] = [];
  favBool: boolean = false;
  cantidadFavoritos: number = 0;
  constructor(
    public _futbol: FutbolInnService,
    private _auth: AuthService,
    private _storage: AlmacenamientoService,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getFavLocal();
  }

  ngAfterViewInit(){
    //this.verificarFav();
  }

  /* verificarFav(){
    this._futbol.obtenerFavoritos(this._auth.usuario.uid)
    .subscribe((respFav) => {
      for(let idDoc of respFav){
        for(let fav of idDoc.favoritos){

          
        }
      }
    }, (errno) => {});
  } */

  
  getFavLocal(){
    this._futbol.obtenerFavoritos(this._auth.usuario.uid)
    .subscribe((respData) => {
      
      this.cantidadFavoritos = respData[0].data.length;
      this.favoritos = [];
      if(respData[0].data.length > 0){
        respData[0].data.map(a => {
          
          combineLatest([
            this._futbol.getSearchEstablecimiento(a),
            this._futbol.varificarFav(a)
          ]).subscribe(([establecimiento, verificar]) => {
            if(establecimiento.exists){
              
              this.favoritos.push({respLocal: establecimiento.data(), idDoc: a, favBo: this._futbol.favoritosBool});
            }else{
              this.favoritos = [];
            }
          }, (errno) => {})
          
        });
      }else{
        this.favoritos = [];
      }
      
    }, (errno) => {});
  }

  borrarFav(idDocLocal: string){
    
    this._futbol.idDocFavoritos(this._auth.usuario.uid)
    .subscribe(() => {
      if(this._futbol.favoritosIdDoc.length > 0){
        
         this._futbol.borraFavorito(this._futbol.favoritosIdDoc, idDocLocal)
         .then(() => {
           
           this.getFavLocal();
         }).catch((errno) => {});
      }
    }, (errno) => {});
    
  }

  async abrirLocal(fav: any){
    
    await this._storage.set('idDocLocal', fav.idDoc);
    setTimeout(() => {
      this._navCtrl.navigateForward('/tabs-informacion/informacion-cancha');
    }, 150);
  }

}
