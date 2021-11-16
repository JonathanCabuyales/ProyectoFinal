import { Component, OnInit } from '@angular/core';
import { ComentariosService } from '../../../services/comentarios.service';
import { AuthService } from '../../../services/auth.service';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { EditComentComponent } from '../../components/edit-coment/edit-coment.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-comentarios-cliente',
  templateUrl: './comentarios-cliente.page.html',
  styleUrls: ['./comentarios-cliente.page.scss'],
})
export class ComentariosClientePage implements OnInit {

  constructor(
    public _comentarios: ComentariosService,
    private _auth: AuthService,
    private _storage: AlmacenamientoService,
    private _popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.getAllComentarios();
    
    
  }

  getAllComentarios(){
    
    this._comentarios.getAllComentariosUser(this._auth.usuario.uid)
    .subscribe(() => {
      
      
    })
      
    

  }

  async abrirEditcoment(evento:any, idLocal:string, idUser:string){
    const popover = await this._popoverCtrl.create({
      component: EditComentComponent,
      event: evento,
      componentProps: {
        uidLocal: idLocal,
        uidUser: idUser
      }
    })

    await popover.present();


    setTimeout(() => {
      popover.dismiss();
    }, 1200);
  }

}
