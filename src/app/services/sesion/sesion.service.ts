import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/*
 * Este servicio gestiona el estado de sesión del administrador en la aplicación.
 * Utiliza el almacenamiento local (localStorage) para guardar, comprobar y eliminar
 * el estado de sesión. Es utilizado principalmente para proteger rutas o funcionalidades
 * que requieren autenticación como administrador.
 */
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

