import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenericoService } from '../../../services/generico.service';
import { TabsGenerico } from '../../../interfaces/interfaces.futbol';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { combineLatest } from 'rxjs';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-tabs-informacion',
  templateUrl: './tabs-informacion.page.html',
  styleUrls: ['./tabs-informacion.page.scss'],
})
export class TabsInformacionPage implements OnInit, OnDestroy {
  tabsClienteLocal: TabsGenerico[];
  tabNombre: boolean = false;
  constructor(
    private _serviceGenerico: GenericoService,
    private _storage: AlmacenamientoService,
    private _futbolService: FutbolInnService,
    private _chat: ChatService
  ) { }

  ngOnInit() {
    this.getTabs();
    this.getIdOfDoc();
  }

  getTabs(){
    this._serviceGenerico.getTabsInformacion()
    .subscribe( tabs =>{
      this.tabsClienteLocal = tabs;
    }, (errno) => {
      
      
    });
  }

  

  cambiarTab(evento:any){
    
    this.tabNombre = true;
  }

  ver(evento:any){
    
    
  }
  getIdOfDoc(){
    
    
    
  }

  
  //funcion para quitar la data del storage
  ngOnDestroy(){
    
    this._storage.limpiarKey('idDocLocal');
    this._storage.limpiarKey('idDocReserva');
    this._storage.limpiarKey('idDocMensajes');
  }
}
