export interface Chat{
    nombreTo:string;
    nombreFrom:string;
    mensajes: any;
    created_at: any;
    activo:boolean;
    to: string;
    from: string;
}

export interface dataMensaje{
    nomLocal: string;
    nomUser: string;
    uidDocLocal: string;
    uidDocUser: string;
}

export interface mensajes{
    fecha: string;
    hora: string;
    msj: string;
    from: string;
}
export interface mensajesLocal{
    fecha: string;
    hora: string;
    msj: string;
}

//interfaces para las notificaciones
export interface notificaciones{
    body: string;
    click_action: string;
    data: notificacion; 
    fecha: number;
    id: string;
    para: string;
    tipo: string;
    title: string;


}

export interface notificacion{
    mensajes: string;
    nombre: string;
    paraId: string;
    tipo: string;
    abrirNoti: string;
    idReserva: string;
}

export interface datos{
    mensajes: string;
    nombre: string;
    paraId: string;
    tipo: string;
}
