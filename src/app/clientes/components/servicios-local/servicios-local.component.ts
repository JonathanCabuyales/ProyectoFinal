import { Component, Input, OnInit } from '@angular/core';
import { OtrosServicios } from 'src/app/interfaces/interfaces.futbol';

@Component({
  selector: 'app-servicios-local',
  templateUrl: './servicios-local.component.html',
  styleUrls: ['./servicios-local.component.scss'],
})
export class ServiciosLocalComponent implements OnInit {

  @Input() otrosServicios: OtrosServicios;

  constructor() { }

  ngOnInit() {}

}
