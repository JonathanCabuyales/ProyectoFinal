import { Component, OnInit } from '@angular/core';
import { FutbolInnService } from '../../../services/futbol-inn.service';
import { ModalController, MenuController } from '@ionic/angular';
import { ModificarPage } from '../../../clientes/pages/modificar/modificar.page';
import { AuthService } from '../../../services/auth.service';
import { SubirFotosPage } from '../../../clientes/pages/subir-fotos/subir-fotos.page';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  datosPersonales: any[] = [];
  constructor(
    public _futbolInn: FutbolInnService,
    private _modalCtrl: ModalController,
    private _auth: AuthService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.getDatosPersonales();
  }

 /*  ionViewWillEnter(): void {
    this.menu.enable(false);
  }
  
  ionViewWillLeave(): void {
    this.menu.enable(true);
  }
 */
  abrirMenu(){
    this.menu.enable(true, 'propietario');
    this.menu.open('propietario');
  }

  getDatosPersonales(){
    this._futbolInn.getUserByLocal(this._auth.usuario.uid)
    .subscribe((respData) => {
      
      this.datosPersonales = [];
      respData.docs.map( (datos) => {
        
        this.datosPersonales.push(datos.data());
        
      })
      
    });
  }

  async editField( campo: string, valor: string ){
    const modal = await this._modalCtrl.create({
      component: ModificarPage,
      componentProps: {
        campo: campo.toLowerCase(),
        valor
      }
    });
    await modal.present();

    await modal.onWillDismiss()
    .then(() => {
      
          this._futbolInn.getUserByLocalDoc(this._auth.usuario.uid)
          .subscribe((data) => {
            this.datosPersonales  = [];
            for(let datos of data){
              this.datosPersonales.push(datos);

            }
          })
      
    }).catch(erro => {
      
      
    });
  }

  async subirFotos(){
    const modal = await this._modalCtrl.create({
      component: SubirFotosPage
    });
    await modal.present();

    await modal.onWillDismiss()
    .then(() =>{
      this._futbolInn.getUserByIdDocPerfil(this._auth.usuario.uid)
      .subscribe(() =>{})
    })
  }
}
