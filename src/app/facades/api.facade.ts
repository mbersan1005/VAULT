import { Injectable } from '@angular/core';
import { ApiRequestService } from '../requests/api.requests';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiFacade {

  constructor(private request: ApiRequestService) { }

  public recibirJuegos(): Observable<any>{
    return this.request.recibirJuegos();
  }

  public recibirDatosJuego(id: number): Observable<any>{
    return this.request.recibirDatosJuego(id);
  }

  public inicioSesion(nombre: string, password: string): Observable<any>{
    return this.request.inicioSesion(nombre, password);
  }

  public recibirGeneros(): Observable<any>{
    return this.request.recibirGeneros();
  }

  public recibirPlataformas(): Observable<any>{
    return this.request.recibirPlataformas();
  }

  public recibirTiendas(): Observable<any>{
    return this.request.recibirTiendas();
  }

  public recibirDesarrolladoras(): Observable<any>{
    return this.request.recibirDesarrolladoras();
  }

  public recibirPublishers(): Observable<any>{
    return this.request.recibirPublishers();
  }

  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any>{
    return this.request.recibirJuegosPorCategoria(categoria, nombre);
  }

  public eliminarJuego(idJuego: number): Observable<any>{
    return this.request.eliminarJuego(idJuego);
  }

  public obtenerDatosFormulario(): Observable<any>{
    return this.request.obtenerDatosFormulario();
  }

  public agregarJuego(juegoData: any): Observable<any>{
    return this.request.agregarJuego(juegoData);
  }

  public crearAdministrador(adminData: any): Observable<any>{
    return this.request.crearAdministrador(adminData);
  }

  public editarJuego(juegoData: any): Observable<any>{
    return this.request.editarJuego(juegoData);
  }

  public actualizarDatosAPI(): Observable<any>{
    return this.request.actualizarDatosAPI();
  }

  public recibirJuegosAdmin(): Observable<any>{
    return this.request.recibirJuegosAdmin();
  }

  public purgarDatos(): Observable<any>{
    return this.request.purgarDatos();
  }

  public realizarBusqueda(nombre: string): Observable<any>{
    return this.request.realizarBusqueda(nombre);
  }

  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any>{
    return this.request.realizarBusquedaDesarrolladoras(nombre);
  }

  public realizarBusquedaPublishers(nombre: string): Observable<any>{
    return this.request.realizarBusquedaPublishers(nombre);
  }
}
