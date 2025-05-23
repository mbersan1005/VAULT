import { Injectable } from '@angular/core';
import { ApiRequestService } from '../requests/api.requests';
import { Observable } from 'rxjs';

/**
 * ApiFacade actúa como una capa de abstracción para las peticiones HTTP.
 * Permite a los componentes usar métodos claros y organizados para acceder a la API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiFacade {

  constructor(private request: ApiRequestService) { }

  /** Obtiene todos los juegos disponibles */
  public recibirJuegos(): Observable<any> {
    return this.request.recibirJuegos();
  }

  /** Obtiene los datos de un juego específico por ID */
  public recibirDatosJuego(id: number): Observable<any> {
    return this.request.recibirDatosJuego(id);
  }

  /** Inicia sesión con nombre de usuario y contraseña */
  public inicioSesion(nombre: string, password: string): Observable<any> {
    return this.request.inicioSesion(nombre, password);
  }

  /** Obtiene la lista de géneros disponibles */
  public recibirGeneros(): Observable<any> {
    return this.request.recibirGeneros();
  }

  /** Obtiene la lista de plataformas */
  public recibirPlataformas(): Observable<any> {
    return this.request.recibirPlataformas();
  }

  /** Obtiene la lista de tiendas */
  public recibirTiendas(): Observable<any> {
    return this.request.recibirTiendas();
  }

  /** Obtiene la lista de desarrolladoras */
  public recibirDesarrolladoras(): Observable<any> {
    return this.request.recibirDesarrolladoras();
  }

  /** Obtiene la lista de publishers */
  public recibirPublishers(): Observable<any> {
    return this.request.recibirPublishers();
  }

  /** Busca juegos según una categoría y un nombre */
  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any> {
    return this.request.recibirJuegosPorCategoria(categoria, nombre);
  }

  /** Elimina un juego por su ID */
  public eliminarJuego(idJuego: number): Observable<any> {
    return this.request.eliminarJuego(idJuego);
  }

  /** Obtiene los datos necesarios para mostrar en formularios de juegos */
  public obtenerDatosFormulario(): Observable<any> {
    return this.request.obtenerDatosFormulario();
  }

  /** Envía los datos para agregar un nuevo juego */
  public agregarJuego(juegoData: any): Observable<any> {
    return this.request.agregarJuego(juegoData);
  }

  /** Envía los datos para agregar un nuevo administrador */
  public crearAdministrador(adminData: any): Observable<any> {
    return this.request.crearAdministrador(adminData);
  }

  /** Envía los datos para editar un juego existente */
  public editarJuego(juegoData: any): Observable<any> {
    return this.request.editarJuego(juegoData);
  }

  /** Actualiza los datos desde fuentes externas */
  public actualizarDatosAPI(): Observable<any> {
    return this.request.actualizarDatosAPI();
  }

  /** Obtiene la lista de juegos modificados o insertados por administradores */
  public recibirJuegosAdmin(): Observable<any> {
    return this.request.recibirJuegosAdmin();
  }

  /** Elimina todos los datos añadidos o modificados por administradores */
  public purgarDatos(): Observable<any> {
    return this.request.purgarDatos();
  }

  /** Realiza una búsqueda de juegos por nombre */
  public realizarBusqueda(nombre: string): Observable<any> {
    return this.request.realizarBusqueda(nombre);
  }

  /** Realiza una búsqueda de desarrolladoras por nombre */
  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any> {
    return this.request.realizarBusquedaDesarrolladoras(nombre);
  }

  /** Realiza una búsqueda de publishers por nombre */
  public realizarBusquedaPublishers(nombre: string): Observable<any> {
    return this.request.realizarBusquedaPublishers(nombre);
  }

  /** Obtiene el App ID de una aplicación externa por su nombre */
  public obtenerAppId(nombre: string): Observable<any> {
    return this.request.obtenerAppId(nombre);
  }

}
