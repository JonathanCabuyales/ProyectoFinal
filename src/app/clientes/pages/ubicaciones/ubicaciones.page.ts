import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { RespUbicaciones } from 'src/app/interfaces/interfaces.futbol';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { MenuController, NavController, Platform, LoadingController } from '@ionic/angular';
import { Geolocation, Position } from "@capacitor/geolocation";

declare var L: any;


@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: ['./ubicaciones.page.scss'],
})
export class UbicacionesPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapa') mapElement: ElementRef;
  
  searchAbrir = false;
  buscados:any[] = [];
  mostrarBuscados = [];
  spinner = false;
  marcadores: any[]= [];
  map:any;
  nombreLocalSearch: string = '';
  positionL: any = new Object();
  constructor(
    private _serviceFutbol: FutbolInnService,
    private _storage: AlmacenamientoService,
    private _routerCtrl: NavController,
    private _menu: MenuController,
    private _platform: Platform,
    private _loadingCtrl: LoadingController
  ) {
  }
  
  async ngOnInit() {
    
    //await this._noti.registrarToken();
  }
  async ngAfterViewInit(){
    
    await this._platform.ready()
  }
  
  abrirSearch(){
    this.searchAbrir = !this.searchAbrir;
    this.buscados = [];
    this.map.on('click', () => {
      this.searchAbrir = false;
    });
  }
  
  async ionViewDidEnter(){
    
    await this.getCoordenadas();
    
    
  }

  ionViewDidLeave(){
    this.map.remove();
    this.map.off();
  }

  abriMenucliente(){
    this._menu.enable(true, 'cliente');
    this._menu.open('cliente');
  }

  
  //funcion par aobtener las cordenas del cliente
  async getCoordenadas(){
    const verificarPermisos = await Geolocation.checkPermissions();
    
    try {
      
      switch (verificarPermisos.location) {
        case 'prompt':
          // segundo switch
          const permisosLocation = await Geolocation.requestPermissions();
  
          switch (permisosLocation.location) {
            case 'prompt-with-rationale':
                return this.cargarMapa();
  
              case 'granted':
                return this.cargarMapa();
                
  
                case 'denied':
                  return this.cargarMapa();
            default:
              return this.cargarMapa();
          }
          break;
  
          case 'prompt-with-rationale':
            return this.cargarMapa();
            
          case 'granted':
            return this.cargarMapa();
  
            case 'denied':
              return this.cargarMapa();
        default:
          return this.cargarMapa();
         
        }
    } catch (error) {
      
      
    }
    
    
    
    
  }

  async cargarMapa(){
    try {
      const ubicacion: Position = await Geolocation.getCurrentPosition();
      
      this.mapa(ubicacion.coords.latitude, ubicacion.coords.longitude);
      
    } catch (error) {

      switch (error) {
        case 'location unavailable':
          return this.mapa();
        default:
          return this.mapa();
      }
      
    }
  }

  // funcion para llamar al mapa
  async mapa(latitude: number = -0.19209566652253743, longitude: number = -78.51520889182297){
    const loading = await this._loadingCtrl.create({
      backdropDismiss: false,
      message: 'Cargando mapa',
      spinner: 'crescent',
      showBackdrop:true
    });
    await loading.present();
    this.map = L.map('mapa', {center: [latitude, longitude], zoom:12});
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoidHlzb24yMSIsImEiOiJja28wZWc2eGUwY3J4Mm9udzgxZ2UyczJtIn0.EL9SXrORqd-RVmxedhJdxQ'
      }).addTo(this.map);
      this.agregarMarcadores();

      setTimeout(() => {
        loading.dismiss();
      }, 1500);
  }

  //funcion para agregas los marcadores y la informacion
  agregarMarcadores(){
    let popup:any;
    this._serviceFutbol.getUbicaciones()
    .subscribe( m => {
      m.forEach( (ubicacion) => {
        //
        
        const html = `
        
        <b><h5><b>${ ubicacion.data().nomLocal }</b></h5></b>
        <ion-text>${ ubicacion.data().ubicacion }</ion-text><br/>
        <button id=${ ubicacion.id }> saber más</button>
        `;
        let marker = L.marker([ubicacion.data().latLng.latitude, ubicacion.data().latLng.longitude])
                .addTo(this.map);
                
        this.marcadores.push(marker);
                
        marker.on('click', () => {
          popup = L.popup()
          .setLatLng([ubicacion.data().latLng.latitude, ubicacion.data().latLng.longitude])
          .setContent(html)
          .openOn(this.map);
          if(popup.isOpen()){
            document.getElementById(`${ubicacion.id}`).addEventListener('click', async () =>{
              await this._storage.set('idDocLocal', ubicacion.id);
              marker.closePopup();
              setTimeout(() => {
                this._routerCtrl.navigateForward('/tabs-informacion/informacion-cancha');
              }, 400)
            });
          }
        });

      });
    }, (errno) => {

    });
    
    
  }

  //fin de funcion


  //funcion para mostrar el ayuda de busqueda con ionInput
  mostrarBusquedaLugaresInput(evento: any){
    this.spinner = false;
    
    if(evento.detail && evento.detail['srcElement']['value']){
      let valorBuscar: string = evento.detail.srcElement.value;
      
      this.spinner = true;
      this._serviceFutbol.getUbicaciones()
      .subscribe( m => {
        
        this.buscados = [];
        this.mostrarBuscados = [];
        
        m.forEach( data => {
          //
          this.buscados.push({'data': data.data().nomLocal, 'id': data.id});
          
        });
        
        if(valorBuscar.length !== 0){
          this.buscados = this.buscados.filter(d => {
            return d.data.toLowerCase().includes(valorBuscar.toLowerCase());
          });
          this.spinner = false;
        }else{
          this.spinner = false;
          
          return this.buscados;
        }
      }, (errno) => {

      });
    }else{
      this.buscados = [];
    }
    
    
    
  }

  //funcion para cancelar la busqueda ionCancel
  cancelado(){
    this.buscados = [];
    this.spinner = false;
    this.agregarMarcadores();
    this.map.setZoom(11);
    
  }
  //funcion para limpiar ionClear
  limpiar(){
    this.buscados = [];
    this.spinner = false;
    this.agregarMarcadores();
    this.map.setZoom(11);
    
  }

  //funcion para ionFocus
  limpiarTexto(){
    this.nombreLocalSearch = '';
    this.agregarMarcadores();
    this.map.setZoom(11);
  }

  //funcion para buscar establecimiento
  buscarEstablecimiento(id:any){
    
    this._serviceFutbol.getSearchEstablecimiento(id).subscribe( (resp) => {
      this.marcadores.forEach( lugares => {
        lugares.remove();
        
      });
      this.nombreLocalSearch = resp.data().nomLocal;
      this.agregarMarcadorBuscador(resp.data(), resp.id);
      this.buscados = [];
      this.spinner = false;
      this.searchAbrir = false;
      //
      
    }, (errno) => {

    });
    
  }

  //funcion para agregar marcador del buscador
  agregarMarcadorBuscador(data:RespUbicaciones, docId:string){
    this.marcadores = [];
    let popup;
    
    const html = '<h5 ><b>'+`${ data.nomLocal }`+'</b></h5> ' + 
        '<ion-text >'+`${ data.ubicacion }`+'</ion-text><br/> ' +
        ' <button  id='+`${ docId }>`+'saber más</button>';
        
    let marker = L.marker([data.latLng.latitude, data.latLng.longitude]).addTo(this.map);

    this.map.setView([data.latLng.latitude, data.latLng.longitude], 17);
    
    marker.on('click', (e) => {
      
      popup = L.popup().setLatLng([e.latlng.lat, e.latlng.lng])
          .setContent(html)
          .openOn(this.map);

      if(popup.isOpen()){
        document.getElementById(`${docId}`).addEventListener('click', async () =>{
        await this._storage.set('idDocLocal', docId);
        marker.closePopup();
          setTimeout(() => {
            this._routerCtrl.navigateForward('/tabs-informacion/informacion-cancha');
          }, 700);
        });
      }
    });
    
  }

  //funcion para mostrar la posicion actual
  async getPisitionACtual(){
    //const lnglat = await this.getCoordenadas();
    /* let popoup = new mapboxgl.Popup().setHTML('<small>Posición actual</small>');
    new mapboxgl.Marker()
    .setLngLat([lnglat.lng, lnglat.lat])
    .setPopup( popoup )
    .addTo(this.map)
    .togglePopup(); */

    

    /* this.map.flyTo({
      center: [lnglat.lng, lnglat.lat],
      essential: true,
      zoom: 11
    }); */
  }

  //funciona para registrar el token de notificaciones
  

  ngOnDestroy(){
    /* this.map.on('remove', () => {

    }); */
  }

  

}
