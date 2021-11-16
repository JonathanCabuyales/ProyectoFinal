import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'slides',
    loadChildren: () => import('./pages/slides/slides.module').then( m => m.SlidesPageModule)
  },
  {
    path: 'tabs-cliente',
    loadChildren: () => import('./clientes/pages/tabs-cliente-cancha/tabs-cliente.module').then( m => m.TabsClientePageModule)
  },
  {
    path: 'tabs-informacion',
    loadChildren: () => import('./clientes/pages/tabs-informacion/tabs-informacion.module').then( m => m.TabsInformacionPageModule)
  },
  {
    path: 'chat-directo',
    loadChildren: () => import('./clientes/pages/chat-directo/chat-directo.module').then( m => m.ChatDirectoPageModule)
  },
  {
    path: 'comentarios-cliente',
    loadChildren: () => import('./clientes/pages/comentarios-cliente/comentarios-cliente.module').then( m => m.ComentariosClientePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./clientes/pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'tabs-propietario',
    loadChildren: () => import('./propietario/pages/tabs-propietario/tabs-propietario.module').then( m => m.TabsPropietarioPageModule)
  },
  {
    path: 'slides-prop',
    loadChildren: () => import('./propietario/pages/slides-prop/slides-prop.module').then( m => m.SlidesPropPageModule)
  },
  {
    path: 'modificar-datos',
    loadChildren: () => import('./propietario/pages/modificar-datos/modificar-datos.module').then( m => m.ModificarDatosPageModule)
  },
  {
    path: 'modificar-horarios',
    loadChildren: () => import('./propietario/pages/modificar-horarios/modificar-horarios.module').then( m => m.ModificarHorariosPageModule)
  },
  {
    path: 'modificar-redes',
    loadChildren: () => import('./propietario/pages/modificar-redes/modificar-redes.module').then( m => m.ModificarRedesPageModule)
  },
  {
    path: 'agregar-redes',
    loadChildren: () => import('./propietario/pages/agregar-redes/agregar-redes.module').then( m => m.AgregarRedesPageModule)
  },
  {
    path: 'modificar-telf',
    loadChildren: () => import('./propietario/pages/modificar-telf/modificar-telf.module').then( m => m.ModificarTelfPageModule)
  },
  {
    path: 'modificar-serv',
    loadChildren: () => import('./propietario/pages/modificar-serv/modificar-serv.module').then( m => m.ModificarServPageModule)
  },
  {
    path: 'mensajes-resp/:idLocal/:idUser',
    loadChildren: () => import('./propietario/pages/mensajes-resp/mensajes-resp.module').then( m => m.MensajesRespPageModule)
  },
  {
    path: 'modal-comentario',
    loadChildren: () => import('./clientes/pages/modal-comentario/modal-comentario.module').then(m => m.ModalComentarioPageModule)
  },
  {
    path: 'editar-comentario',
    loadChildren: () => import('./clientes/pages/modificar-comentario/modificar-comentario.module').then(m => m.ModificarComentarioPageModule)    
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./clientes/pages/mensajes/mensajes.module').then(m => m.MensajesPageModule)    
  },
  {
    path: 'modificar-coment',
    loadChildren: () => import('./propietario/pages/modificar-coment/modificar-coment.module').then( m => m.ModificarComentPageModule)
  },
  {
    path: 'informacion-cliente',
    loadChildren: () => import('./propietario/pages/informacion-cliente/informacion-cliente.module').then( m => m.InformacionClientePageModule)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./clientes/pages/modificar/modificar.module').then( m => m.ModificarPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./pages/password-recovery/password-recovery.module').then( m => m.PasswordRecoveryPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./clientes/pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'subir-fotos',
    loadChildren: () => import('./clientes/pages/subir-fotos/subir-fotos.module').then( m => m.SubirFotosPageModule)
  },
  {
    path: 'responder-comentarios',
    loadChildren: () => import('./propietario/pages/responder-comentarios/responder-comentarios.module').then( m => m.ResponderComentariosPageModule)
  },
  {
    path: 'agregar-imagenes',
    loadChildren: () => import('./propietario/pages/agregar-imagenes/agregar-imagenes.module').then( m => m.AgregarImagenesPageModule)
  },  {
    path: 'historial',
    loadChildren: () => import('./propietario/pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'ver-notificacion',
    loadChildren: () => import('./clientes/pages/ver-notificacion/ver-notificacion.module').then( m => m.VerNotificacionPageModule)
  },
  {
    path: 'notificacion-p',
    loadChildren: () => import('./propietario/pages/notificacion-p/notificacion-p.module').then( m => m.NotificacionPPageModule)
  }







  
  
  
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
