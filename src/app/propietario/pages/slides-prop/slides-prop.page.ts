import { Component, OnInit } from '@angular/core';
import { GenericoService } from '../../../services/generico.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-slides-prop',
  templateUrl: './slides-prop.page.html',
  styleUrls: ['./slides-prop.page.scss'],
})
export class SlidesPropPage implements OnInit {
  slides: any = [];

  constructor(
    private _slides: GenericoService,
    private _storage: AlmacenamientoService,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getslides();
  }

  getslides(){
    this._slides.getSlidesPropietario()
    .subscribe( resp => {
      
      
      this.slides = resp;
    });
  }

  omitirPresentaciones(){
    this._storage.set('omitirSlidesP', true);
    this._navCtrl.navigateForward('/tabs-propietario/pricipal-reservas');
  }

}
