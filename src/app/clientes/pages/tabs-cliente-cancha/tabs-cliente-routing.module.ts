import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsClientePage } from './tabs-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: TabsClientePage,
    children: [
      {
        path: 'ubicaciones',
        loadChildren: () => import('../ubicaciones/ubicaciones.module').then( m => m.UbicacionesPageModule)
      },
      {
        path: 'historial-reservas',
        loadChildren: () => import('../historial-reservas/historial-reservas.module').then( m => m.HistorialReservasPageModule)
      },
      {
        path: 'reservas-activas-cliente',
        loadChildren: () => import('../reservas-activas-cliente/reservas-activas-cliente.module').then( m => m.ReservasActivasClientePageModule)
      },
      {
        path: 'perfil-user',
        loadChildren: () => import('../perfil-user/perfil-user.module').then( m => m.PerfilUserPageModule)
      },
      {
        path: 'mensajes',
        loadChildren: () => import('../mensajes/mensajes.module').then( m => m.MensajesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsClientePageRoutingModule {}
