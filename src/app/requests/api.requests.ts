import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  //URL base de la API
  baseUrl: string = 'https://api-vault.onrender.com';
  //baseUrl: string = 'https://apirest.saicasl.eu/api1/api/publi';

  //Token de autenticación personalizado y clave Authorization (Bearer token)
  apiToken: string = '318be955-c62b-40d7-a7b3-c4de08ceb444';
  authorizationKey: string = 'Bearer i8zz9PWQdXr7OpKW2BMZ4LgH8tXE3ms3H2YLuEFmfrGTVkt2Gxm9i3VdJdSCS47A';

  /*CONSTRUCTOR*/
  constructor(private http: HttpClient) { }

  //Devuelve los encabezados comunes para autenticación en cada solicitud
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  }

  //Obtiene un JSON con todos los juegos de la base de datos
  public recibirJuegos(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirJuegos", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con los datos de un juego específico por ID
  public recibirDatosJuego(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/recibirDatosJuego/${id}`, { headers: this.getHeaders() });
  }

  //Inicia sesión con nombre de usuario y contraseña
  public inicioSesion(nombre: string, password: string): Observable<any> {
    const body = { nombre, password };
    return this.http.post(`${this.baseUrl}/inicioSesion`, body, { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todos los géneros de la base de datos
  public recibirGeneros(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirGeneros", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todas las plataformas de la base de datos
  public recibirPlataformas(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirPlataformas", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todas las tiendas de la base de datos
  public recibirTiendas(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirTiendas", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todas las desarrolladoras de la base de datos
  public recibirDesarrolladoras(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirDesarrolladoras", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todos los publishers de la base de datos
  public recibirPublishers(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirPublishers", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todos los juegos según un tipo de categoría y nombre del registro al que pertenece
  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any> {
    const url = `${this.baseUrl}/recibirJuegosFiltrados/${categoria}/${nombre}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  //Elimina un juego por su ID de la base de datos
  public eliminarJuego(idJuego: number): Observable<any> {
    const body = { id: idJuego };
    return this.http.post(this.baseUrl + "/eliminarJuego", body, { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todos los datos necesarios para mostrar información en los formularios
  public obtenerDatosFormulario(): Observable<any> {
    return this.http.get(this.baseUrl + "/obtenerDatosFormulario", { headers: this.getHeaders() });
  }

  //Envía los datos para agregar un nuevo juego a la base de datos
  public agregarJuego(juegoData: any): Observable<any> {
    return this.http.post(this.baseUrl + "/agregarJuego", juegoData, { headers: this.getHeaders() })
  }

  //Envía los datos para agregar un nuevo administrador a la base de datos
  public crearAdministrador(adminData: any): Observable<any> {
    return this.http.post(this.baseUrl + "/crearAdministrador", adminData, { headers: this.getHeaders() })
  }

  //Envía los datos para editar un juego existente de la base de datos
  public editarJuego(juegoData: any): Observable<any> {
    return this.http.post(this.baseUrl + "/editarJuego", juegoData, { headers: this.getHeaders() })
  }

  /*Actualiza los datos de la base de datos utilizando API Externas, sin eliminar datos
  insertados o modificados por administradores*/
  public actualizarDatosAPI(): Observable<any> {
    return this.http.get(this.baseUrl + "/actualizarDatosAPI", { headers: this.getHeaders() });
  }

  //Obtiene un JSON con todos juegos modificados o insertados por administradores
  public recibirJuegosAdmin(): Observable<any> {
    return this.http.get(this.baseUrl + "/recibirJuegosAdmin", { headers: this.getHeaders() });
  }

  /*Actualiza los datos de la base de datos utilizando API Externas, eliminando datos
  insertados o modificados por administradores*/
  public purgarDatos(): Observable<any> {
    return this.http.get(this.baseUrl + "/purgarDatos", { headers: this.getHeaders() });
  }

  //Realiza una búsqueda de juegos por nombre
  public realizarBusqueda(nombre: string): Observable<any> {
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusqueda`, body, { headers: this.getHeaders() });
  }

  //Realiza una búsqueda de desarrolladoras por nombre
  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any> {
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusquedaDesarrolladoras`, body, { headers: this.getHeaders() });
  }

  //Realiza una búsqueda de publishers por nombre
  public realizarBusquedaPublishers(nombre: string): Observable<any> {
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusquedaPublishers`, body, { headers: this.getHeaders() });
  }

  //Obtiene el AppID de un juego según su nombre en la plataforma de Steam
  public obtenerAppId(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombreJuego', nombre);
    return this.http.get(`${this.baseUrl}/obtenerAppId`, { headers: this.getHeaders(), params });
  }


}
