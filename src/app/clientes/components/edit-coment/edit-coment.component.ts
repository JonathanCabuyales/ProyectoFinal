import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModificarComentarioPage } from '../../pages/modificar-comentario/modificar-comentario.page';
import { ModificarComentPage } from '../../../propietario/pages/modificar-coment/modificar-coment.page';

@Component({
  selector: 'app-edit-coment',
  templateUrl: './edit-coment.component.html',
  styleUrls: ['./edit-coment.component.scss'],
})
export class EditComentComponent implements OnInit {

  @Input() uidLocal: string;
  @Input() uidUser: string;
  @Input() modificarLocal: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
    
  ) { }

  ngOnInit() {}

  async editarComentario(){
    const modal = await this._modalCtrl.create({
      component: ModificarComentarioPage,
      componentProps:{
        uidLocal: this.uidLocal,
        uidUser: this.uidUser
      }
    });

    await modal.present();
  }

  async editarComentarioLocal(){
    const modal = await this._modalCtrl.create({
      component: ModificarComentPage,
      componentProps:{
        uidLocal: this.uidLocal,
        uidUser: this.uidUser
      }
    });
    await modal.present();
  }
}
