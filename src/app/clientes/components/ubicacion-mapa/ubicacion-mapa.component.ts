import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { RespUbicaciones } from 'src/app/interfaces/interfaces.futbol';
declare var L: any;

@Component({
  selector: 'app-ubicacion-mapa',
  templateUrl: './ubicacion-mapa.component.html',
  styleUrls: ['./ubicacion-mapa.component.scss'],
})
export class UbicacionMapaComponent implements OnInit, AfterViewInit {
  @Input() data:RespUbicaciones;
  map:any;
  constructor(
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    
    
    
      
  }
  ngAfterViewInit(){
    
  }
  async ionViewDidEnter(){
    
    await this.mapa(this.data.latLng.latitude, this.data.latLng.longitude);
    
  }

  async mapa(latitude: number = -0.19209566652253743, longitude: number = -78.51520889182297){
    const loading = await this._loadingCtrl.create({
      backdropDismiss: false,
      message: 'Cargando mapa',
      spinner: 'crescent',
      showBackdrop:true
    });
    await loading.present();
    this.map = L.map('mapas', {center: [latitude, longitude], zoom:16});
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoidHlzb24yMSIsImEiOiJja28wZWc2eGUwY3J4Mm9udzgxZ2UyczJtIn0.EL9SXrORqd-RVmxedhJdxQ',
        tileSize: 512,
        zoomOffset: -1
      }).addTo(this.map);
      this.agregarMarcadores();

      setTimeout(() => {
        loading.dismiss();
      }, 700);
  }

  cerrar(){
    this._modalCtrl.dismiss();
  }

  agregarMarcadores(){
    let popup:any;
    const html = `
        
        <b><h5><b>${ this.data.nomLocal }</b></h5></b>
        <ion-text>${ this.data.ubicacion }</ion-text><br/>
        `;
        let marker = L.marker([this.data.latLng.latitude, this.data.latLng.longitude])
                .addTo(this.map);
                
        marker.on('click', () => {
          popup = L.popup()
          .setLatLng([this.data.latLng.latitude, this.data.latLng.longitude])
          .setContent(html)
          .openOn(this.map);
        });
    
  }

}
