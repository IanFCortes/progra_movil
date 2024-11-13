import { Time } from "@angular/common";

export interface Viaje{
    coste: number,
    destino: string,
    id: string,
    pasajeros: number,
    disponibles: number,
    emailP: string,
    patente: string,
    salida: Time,
    completo: boolean
}