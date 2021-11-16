import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsInformacionPage } from './tabs-informacion.page';

const routes: Routes = [
  {
    path: '',
    component: TabsInformacionPage,
    children: [
      {
        path: 'informacion-cancha',
        loadChildren: () => import('../informacion-cancha/informacion-cancha.module').then( m => m.InformacionCanchaPageModule)
      },
      {
        path: 'reservar',
        loadChildren: () => import('../reservar/reservar.module').then( m => m.ReservarPageModule)
      },
      {
        path: 'reservas-activas',
        loadChildren: () => import('../reservas-activas/reservas-activas.module').then( m => m.ReservasActivasPageModule)
      },
      {
        path: 'mensajes-local',
        loadChildren: () => import('../mensajes-local/mensajes-local.module').then( m => m.MensajesLocalPageModule)
      },
      {
        path: 'comentarios',
        loadChildren: () => import('../comentarios/comentarios.module').then( m => m.ComentariosPageModule)
      },
      /* {
        path: 'mensajes',
        loadChildren: () => import('../../../pages/mensajes/mensajes.module').then( m => m.MensajesPageModule)
      }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsInformacionPageRoutingModule {}
