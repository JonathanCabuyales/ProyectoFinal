import { Component, Input, OnInit } from '@angular/core';
import { Horarios } from 'src/app/interfaces/interfaces.futbol';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss'],
})
export class HorariosComponent implements OnInit {


  @Input() horarioSemana: Horarios;
  constructor() { }

  ngOnInit() {}

}
