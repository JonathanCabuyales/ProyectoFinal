import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataSlidesInterface, TabsGenerico } from '../interfaces/interfaces.futbol';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {

  constructor(
    private _http: HttpClient
  ) { }

  getSlides(){
    return this._http.get<dataSlidesInterface[]>('/assets/data/dataSlides.json');
  }

  getTabsPrincipales(){
    return this._http.get<TabsGenerico[]>('/assets/data/tabsPrincipal.json');
  }
  getTabsInformacion(){
    return this._http.get<TabsGenerico[]>('/assets/data/tabsLocal.json');
  }

  getMenuCliente(){
    return this._http.get('/assets/data/menuOptCliente.json');
  }
  getMenuPropietario(){
    return this._http.get('/assets/data/menuOptPropietario.json');
  }

  getSlidesPropietario(){
    return this._http.get('/assets/data/dataSlidesP.json');
  }
  
  getTabsPropietario(){
    return this._http.get('/assets/data/tabsPrincipalProp.json');

  }
}
