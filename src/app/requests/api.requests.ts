import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  // URL base de la API
  baseUrl: string = 'https://api-vault.onrender.com';
  //baseUrl: string = 'https://apirest.saicasl.eu/api1/api/publi';

  // Token de autenticación personalizado y clave Authorization (Bearer token)
  apiToken: string = '318be955-c62b-40d7-a7b3-c4de08ceb444';
  authorizationKey: string = 'Bearer i8zz9PWQdXr7OpKW2BMZ4LgH8tXE3ms3H2YLuEFmfrGTVkt2Gxm9i3VdJdSCS47A';

  /*CONSTRUCTOR*/
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  }

  public recibirJuegos(): Observable<any>{
    return this.http.get(this.baseUrl + "/recibirJuegos", { headers: this.getHeaders() });
  }

  public recibirDatosJuego(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/recibirDatosJuego/${id}`, { headers: this.getHeaders() });
  }

  public inicioSesion(nombre: string, password: string): Observable<any> {
    const body = { nombre, password };
    return this.http.post(`${this.baseUrl}/inicioSesion`, body, { headers: this.getHeaders() });
  }
  
  public recibirGeneros(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirGeneros", { headers: this.getHeaders() });
  }

  public recibirPlataformas(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirPlataformas", { headers: this.getHeaders() });
  }

  public recibirTiendas(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirTiendas", { headers: this.getHeaders() });
  }

  public recibirDesarrolladoras(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirDesarrolladoras", { headers: this.getHeaders() });
  }

  public recibirPublishers(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirPublishers", { headers: this.getHeaders() });
  }

  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any>{
    const url = `${this.baseUrl}/recibirJuegosFiltrados/${categoria}/${nombre}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  public eliminarJuego(idJuego: number): Observable<any> {
    const body = { id: idJuego };
    return this.http.post(this.baseUrl + "/eliminarJuego", body, { headers: this.getHeaders() });
  }
  
  public obtenerDatosFormulario(): Observable<any>{
    return this.http.get(this.baseUrl+"/obtenerDatosFormulario", { headers: this.getHeaders() });
  }

  public agregarJuego(juegoData: any): Observable<any>{
    return this.http.post(this.baseUrl + "/agregarJuego", juegoData, { headers: this.getHeaders() })
  }

    public crearAdministrador(adminData: any): Observable<any>{
    return this.http.post(this.baseUrl + "/crearAdministrador", adminData, { headers: this.getHeaders() })
  }

  public editarJuego(juegoData: any): Observable<any>{
    return this.http.post(this.baseUrl + "/editarJuego", juegoData, { headers: this.getHeaders() })
  }

  public actualizarDatosAPI(): Observable<any>{
    return this.http.get(this.baseUrl+"/actualizarDatosAPI", { headers: this.getHeaders() });
  }

  public recibirJuegosAdmin(): Observable<any>{
    return this.http.get(this.baseUrl+"/recibirJuegosAdmin", { headers: this.getHeaders() });
  }

  public purgarDatos(): Observable<any>{
    return this.http.get(this.baseUrl+"/purgarDatos", { headers: this.getHeaders()} );
  }

  public realizarBusqueda(nombre: string): Observable<any>{
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusqueda`, body, { headers: this.getHeaders() });
  }

  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any>{
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusquedaDesarrolladoras`, body, { headers: this.getHeaders() });
  }

  public realizarBusquedaPublishers(nombre: string): Observable<any>{
    const body = { nombre };
    return this.http.post(`${this.baseUrl}/realizarBusquedaPublishers`, body, { headers: this.getHeaders() });
  }

  public obtenerAppId(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombreJuego', nombre);
    return this.http.get(`${this.baseUrl}/obtenerAppId`, { headers: this.getHeaders(), params });
  }
  

}
