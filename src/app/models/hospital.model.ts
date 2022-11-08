

interface _HospitalUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Hospital {
    constructor(
        public uid: string,
        public nombre: string,
        public _id?: string,
        public usuario?: string,
        public img?: _HospitalUser,
    ){}
}

export interface HospitalInterface{
    ok: boolean;
    hospitales: Hospitales[];
    uid: string;
}

export interface Hospitales{
    _id: string;
    nombre: string;
    usuario: _HospitalUser;
    img?: string;
}