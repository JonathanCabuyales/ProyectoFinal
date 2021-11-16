export interface comentariosInterface{
    comentarios: {
        comentUser: {
            comentario: string;
            fecha: string;
            hora: string;
            valorCalificacion: number;
            id: string;
        };
        comentResp:{
            resp: boolean;
            comentario?: string;
            fecha?:string;
            hora?:string;
            id?: string;
        };
    };
    dataInfo: {
        nomLocal: string;
        nomUser: string;
        uidLocal: string;
        uidUser: string;
    };
}

export interface fav{
    fav: boolean;
    favoritos: any[];
    idUser: string;
    length?: number;
}