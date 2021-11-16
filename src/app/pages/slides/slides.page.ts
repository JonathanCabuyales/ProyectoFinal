import { Component, OnInit } from '@angular/core';
import { GenericoService } from '../../services/generico.service';
import { Observable } from 'rxjs';
import { dataSlidesInterface } from 'src/app/interfaces/interfaces.futbol';
import { AlmacenamientoService } from '../../services/almacenamiento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  slidesData: Observable<dataSlidesInterface[]>;

  constructor(
    private _slides: GenericoService,
    private _storage: AlmacenamientoService,
    private _route: Router
  ) { }

  ngOnInit() {
    this.slidesData = this._slides.getSlides();
    
  }

  omitirPresentaciones(){
    this._storage.set('omitirSlides', true);
    this._route.navigateByUrl('/tabs-cliente/ubicaciones');
  }

}
