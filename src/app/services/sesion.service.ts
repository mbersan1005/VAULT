import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private readonly claveSesion = 'adminSesionActiva';

  constructor() { }

  establecerSesion(estado: boolean) {
    localStorage.setItem(this.claveSesion, estado ? 'true' : 'false');
  }

  comprobarSesion(): boolean {
    return localStorage.getItem(this.claveSesion) === 'true';
  }

  cerrarSesion() {
    localStorage.removeItem(this.claveSesion);
  }
}

