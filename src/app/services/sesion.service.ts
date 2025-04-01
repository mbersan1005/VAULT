import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private sesionEstablecida: boolean = false;

  constructor() { }

  establecerSesion(estado: boolean){
    this.sesionEstablecida = estado;
  }

  comprobarSesion(): boolean{
    return this.sesionEstablecida;
  }

}
