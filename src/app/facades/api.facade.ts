import { Injectable } from '@angular/core';
import { ApiRequestService } from '../requests/api.requests';
import { Observable } from 'rxjs';

/*
 * ApiFacade actúa como una capa de abstracción para las peticiones HTTP.
 * Permite a los componentes usar métodos claros y organizados para acceder a la API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiFacade {

  constructor(private request: ApiRequestService) { }

  //Devuelve todos los juegos disponibles
  public recibirJuegos(): Observable<any> {
    return this.request.recibirJuegos();
  }

  //Devuelve los datos de un juego por ID
  public recibirDatosJuego(id: number): Observable<any> {
    return this.request.recibirDatosJuego(id);
  }

  //Realiza el inicio de sesión
  public inicioSesion(nombre: string, password: string): Observable<any> {
    return this.request.inicioSesion(nombre, password);
  }

  //Devuelve todos los géneros
  public recibirGeneros(): Observable<any> {
    return this.request.recibirGeneros();
  }

  //Devuelve todas las plataformas
  public recibirPlataformas(): Observable<any> {
    return this.request.recibirPlataformas();
  }

  //Devuelve todas las tiendas
  public recibirTiendas(): Observable<any> {
    return this.request.recibirTiendas();
  }

  //Devuelve todas las desarrolladoras
  public recibirDesarrolladoras(): Observable<any> {
    return this.request.recibirDesarrolladoras();
  }

  //Devuelve todos los publishers
  public recibirPublishers(): Observable<any> {
    return this.request.recibirPublishers();
  }

  //Devuelve juegos filtrados por categoría y nombre del registro al que pertenece
  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any> {
    return this.request.recibirJuegosPorCategoria(categoria, nombre);
  }

  //Elimina un juego por ID
  public eliminarJuego(idJuego: number): Observable<any> {
    return this.request.eliminarJuego(idJuego);
  }

  //Devuelve los datos necesarios para formularios
  public obtenerDatosFormulario(): Observable<any> {
    return this.request.obtenerDatosFormulario();
  }

  //Agrega un nuevo juego
  public agregarJuego(juegoData: any): Observable<any> {
    return this.request.agregarJuego(juegoData);
  }

  //Crea un nuevo administrador
  public crearAdministrador(adminData: any): Observable<any> {
    return this.request.crearAdministrador(adminData);
  }

  //Edita un juego existente
  public editarJuego(juegoData: any): Observable<any> {
    return this.request.editarJuego(juegoData);
  }

  //Actualiza datos desde fuentes externas
  public actualizarDatosAPI(): Observable<any> {
    return this.request.actualizarDatosAPI();
  }

  //Devuelve juegos insertados o modificados por administradores
  public recibirJuegosAdmin(): Observable<any> {
    return this.request.recibirJuegosAdmin();
  }

  //Elimina datos modificados por administradores y actualiza desde fuentes externas
  public purgarDatos(): Observable<any> {
    return this.request.purgarDatos();
  }

  //Busca juegos por nombre
  public realizarBusqueda(nombre: string): Observable<any> {
    return this.request.realizarBusqueda(nombre);
  }

  //Busca desarrolladoras por nombre
  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any> {
    return this.request.realizarBusquedaDesarrolladoras(nombre);
  }

  //Busca publishers por nombre
  public realizarBusquedaPublishers(nombre: string): Observable<any> {
    return this.request.realizarBusquedaPublishers(nombre);
  }

  //Obtiene el App ID en Steam por nombre de juego
  public obtenerAppId(nombre: string): Observable<any> {
    return this.request.obtenerAppId(nombre);
  }

}
