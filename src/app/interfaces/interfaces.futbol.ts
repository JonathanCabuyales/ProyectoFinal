


export interface dataSlidesInterface{
    img: string,
    titulo: string,
    desc: string
}


export interface horarioReserva{
  activo: boolean;
  created_at: string;
  dataExtra: extraData[];
  local: DatosLocal;
}

export interface MenuOpt{
    icon: string,
    name: string,
    redirecTo:string,
}

export interface TabsGenerico {
  tab: string;
  iconName: string;
  nombre: string;
}

export interface Registro{
  uid: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  contrasenia: string;
  token: Token;
  telf?:string;
  foto?:any[];
  tipo?:string;
}

export interface Token{
  androidId: string;
  token: string;
}

export interface RespUbicaciones {
  ciudad: string;
  numCanchas: number;
  precio: string[] | string;
  id: string;
  eid: string;
  ubicacion: string;
  telf: Telf;
  desc: string;
  redes: Redes;
  nomLocal: string;
  otrosServicios: OtrosServicios;
  latLng: LatLng;
  pais: string;
  horarios: Horarios;
  foto?: fotos[]; 
  nombre?: string;
}

export interface fotos{
  url: string;
  fecha: number;
}

export interface Horarios {
  semana: semana;
  finSemana: finSemana;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface OtrosServicios {
  resp: string;
  verificacion:boolean;
  servicios?: [];
}

export interface Redes {
  redes: boolean;
  red: redesArr[];
}

export interface redesArr{
  color: string;
  icon: string;
  name: string;
  value: string;
}


export interface Telf {
  celular: string[] | string;
  convencional?: string;
}




export interface semana{
  dias: string[];
  hora: string;
}

export interface finSemana{
  dias: string[];
  hora: string;
}

export interface datosPersonales{
  apellido: string;
  nombre: string;
  cedula: string;
  contrasenia: string;
  correo: string;
  foto: fotos[];
  telf: string;
  uid: string;
  tipo:string;
  token?: androidToken;
}

export interface androidToken{
  androidId: string;
  token: string
}

export interface fotos{
  fecha: number;
  url: string;
}

export interface Reservas{
  id: string;
  dataExtra: extraData[];
  dataReserva: ReservaData[];
  usuario: usuario;
  local: DatosLocal;
  activo: boolean;
  created_at: Date;
}

export interface extraData{
  cantidad: number;
  activo: boolean;
  hora: string;
  fechaTime: number;
  diaFecha:string;
}
export interface usuario{
  uidUser: string;
  nombreUser: string;
}

export interface DatosLocal{
  idDocLocal: string;
  nomLocal: string;
}

export interface ReservaData{
  id: string;
  dia: string
  horaInicio: string;
  horaFin: string;
  horasReservadas: any[];
  tiempo: number;
  cantidad: string;
  observaciones: string;
  activo: boolean;
  diaFecha:string;
  fechaReserva:string;
  fechaTiempoReserva: number;
  fechaReservaHecha:string;
  cancelacion?: cancelacion;
  /* diaFecha: string; 
  mesDiaReserva: string;
  anio: string */
}
export interface cancelacion{
  cancelado: boolean;
  motivo: string;
  fecha:number;
}
/* 
export interface cliente{
  cedula: string;
  nombre: string;
  telf: string;
  uid: string;
} */


/* export interface local{
  cantidad: number;
  dia: string;
  hora: string;
  local: string;
  tiempo: string;
  ubicacion: string;
  observaciones?: string;
} */