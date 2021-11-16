import { Component, Input, OnInit } from '@angular/core';
import { Redes } from '../../../interfaces/interfaces.futbol';
import { Browser } from "@capacitor/browser";
import { AppLauncher } from "@capacitor/app-launcher";

@Component({
  selector: 'app-redes',
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss'],
})
export class RedesComponent implements OnInit {

  @Input() redes: Redes;

  constructor() { }

  ngOnInit() {}


  async verRed(valor: string){
    const open = await AppLauncher.canOpenUrl({
      url: valor
    });
    if(open.value){
      await AppLauncher.openUrl({
        url: valor
      });
    }else{
      const openNave = await Browser.open({
        url: valor,
        presentationStyle: 'fullscreen',
        toolbarColor: '#A43F56'
      });
    }
  }

}
