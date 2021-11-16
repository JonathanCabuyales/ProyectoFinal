import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiempoJugarPipe } from './tiempo-jugar.pipe';
import { HistoriaReservaPipe } from './historia-reserva.pipe';
import { UltimoMensajePipe } from './ultimo-mensaje.pipe';
import { MensajesPipe } from './mensajes.pipe';
import { FotosPipe } from './fotos.pipe';
import { FotosPropPipe } from './fotos-prop.pipe';
import { DevolverArregloPipe } from './devolver-arreglo.pipe';
import { TamanioPipe } from './tamanio.pipe';
import { FechaPipe } from './fecha.pipe';



@NgModule({
  declarations: [
    TiempoJugarPipe,
    HistoriaReservaPipe,
    UltimoMensajePipe,
    MensajesPipe,
    FotosPipe,
    FotosPropPipe,
    DevolverArregloPipe,
    TamanioPipe,
    FechaPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TiempoJugarPipe,
    HistoriaReservaPipe,
    UltimoMensajePipe,
    MensajesPipe,
    FotosPipe,
    FotosPropPipe,
    DevolverArregloPipe,
    TamanioPipe,
    FechaPipe
  ]
})
export class PipesModule { }
