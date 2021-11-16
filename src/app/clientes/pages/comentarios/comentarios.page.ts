import { Component, OnInit } from '@angular/core';
import { ComentariosService } from '../../../services/comentarios.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalComentarioPage } from '../modal-comentario/modal-comentario.page';
import { AlmacenamientoService } from '../../../services/almacenamiento.service';
import { EditComentComponent } from '../../components/edit-coment/edit-coment.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  uidUser: boolean = true;
  
  constructor(
    private _storage: AlmacenamientoService,
    private _modalCtrl: ModalController,
    public _comentario: ComentariosService,
    private _popoverCtrl: PopoverController,
    public _auth: AuthService
  
  ) { }

  ngOnInit() {
    
    /* this._auth.isAuth()
    .subscribe( respauth => {
      if(respauth){
        
        
      }else{
        
        
      }
    }) */
  }

  ionViewDidEnter(){
    this.getComentarios();
    this.getuidUser();
  }

  getComentarios(){
    
        this._storage.getData('idDocLocal')
        .then( idDoc => {
          this._comentario.getComentariosEstablecimiento(idDoc)
          .subscribe(() => {
            
            
          });
        });
      
  }

  getuidUser(){
    this._auth.currentUserFirebase()
    .then((resp) =>{
      this._storage.getData('idDocLocal')
        .then( idDoc => {
          this._comentario.getComentariosEstablecimiento(idDoc)
          .subscribe(() => {
            
            for(let i of this._comentario.comentariosArr){
              if(i.dataInfo.uidUser === resp.uid){
                this.uidUser = false;
              }
            }
            
          });
        });
    })
    .catch((err) =>{

    });
      
  }

  async agregarComentario(){
    
   await this._modalCtrl.create({
      component: ModalComentarioPage,
    }).then((resp) => {
      resp.present();
    }).catch((errno) => {});
    
    
    

    
  }

  

  async abrirEditcoment( evento: any, idLocal: string, idUser: string){
    
      await this._popoverCtrl.create({
        component: EditComentComponent,
        event: evento,
        componentProps: {
          uidLocal: idLocal,
          uidUser: idUser,
          modificarLocal: false
        }
      })
      .then((resp) =>{resp.present()})
      .catch((errno) => {})

    
  }
}
