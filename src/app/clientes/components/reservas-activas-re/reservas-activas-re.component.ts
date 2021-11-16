import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-reservas-activas-re',
  templateUrl: './reservas-activas-re.component.html',
  styleUrls: ['./reservas-activas-re.component.scss'],
})
export class ReservasActivasReComponent implements OnInit,AfterViewInit {

  @Input() historialReservas: any[];
  @Input() fechaBuscar:string;

  constructor() { }

  ngOnInit() {
    
  }
  ngAfterViewInit(){
    

  }

}
