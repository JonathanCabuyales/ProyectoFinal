import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPropietarioPage } from './tabs-propietario.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPropietarioPage,
    children: [
    
      {
        path: 'pricipal-reservas',
        loadChildren: () => import('../pricipal-reservas/pricipal-reservas.module').then( m => m.PricipalReservasPageModule)
      },
      {
        path: 'informacion-cancha',
        loadChildren: () => import('../informacion-cancha/informacion-cancha.module').then( m => m.InformacionCanchaPageModule)
      },
      {
        path: 'mensajes-prop',
        loadChildren: () => import('../mensajes-prop/mensajes-prop.module').then( m => m.MensajesPropPageModule)
      },
      {
        path: 'comentarios-prop',
        loadChildren: () => import('../comentarios-prop/comentarios-prop.module').then( m => m.ComentariosPropPageModule)
      },
      {
        path: 'perfil-user',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPropietarioPageRoutingModule {}
