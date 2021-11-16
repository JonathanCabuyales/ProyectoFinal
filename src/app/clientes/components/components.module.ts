import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosLocalComponent } from './servicios-local/servicios-local.component';
import { IonicModule } from '@ionic/angular';
import { HorariosComponent } from './horarios/horarios.component';
import { RedesComponent } from './redes/redes.component';
import { UbicacionMapaComponent } from './ubicacion-mapa/ubicacion-mapa.component';
import { ReservasActivasReComponent } from './reservas-activas-re/reservas-activas-re.component';
import { PipesModule } from '../../pipes/pipes.module';
import { EditComentComponent } from './edit-coment/edit-coment.component';
import { IngresarPCComponent } from './ingresar-pc/ingresar-pc.component';



@NgModule({
  declarations: [
    ServiciosLocalComponent,
    HorariosComponent,
    RedesComponent,
    UbicacionMapaComponent,
    ReservasActivasReComponent,
    EditComentComponent,
    IngresarPCComponent,
    
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
    ServiciosLocalComponent,
    HorariosComponent,
    RedesComponent,
    UbicacionMapaComponent,
    ReservasActivasReComponent,
    EditComentComponent,
    IngresarPCComponent
  ]
})
export class ComponentsModule { }
