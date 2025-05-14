import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  //https://apirest.saicasl.eu/api1/api/public -- https://vault-ci4-api.up.railway.app -- https://api-vault.onrender.com
  baseUrl: string = 'https://apirest.saicasl.eu/api1/api/public';
  apiToken: string = '318be955-c62b-40d7-a7b3-c4de08ceb444';
  authorizationKey: string = 'Bearer i8zz9PWQdXr7OpKW2BMZ4LgH8tXE3ms3H2YLuEFmfrGTVkt2Gxm9i3VdJdSCS47A';

  constructor(private http: HttpClient) { }

  public recibirJuegos(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirJuegos", {headers});
  }

  public recibirDatosJuego(id: number): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(`${this.baseUrl}/recibirDatosJuego/${id}`, { headers });
  }

  public inicioSesion(nombre: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    const body = { nombre, password };
  
    return this.http.post(`${this.baseUrl}/inicioSesion`, body, { headers });
  }
  
  public recibirGeneros(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirGeneros", {headers});
  }

  public recibirPlataformas(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirPlataformas", {headers});
  }

  public recibirTiendas(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirTiendas", {headers});
  }

  public recibirDesarrolladoras(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirDesarrolladoras", {headers});
  }

  public recibirPublishers(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirPublishers", {headers});
  }

  public recibirJuegosPorCategoria(categoria: string, nombre: string): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    const url = `${this.baseUrl}/recibirJuegosFiltrados/${categoria}/${nombre}`;

    return this.http.get(url, { headers });
  }

  public eliminarJuego(idJuego: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    const body = { id: idJuego };
  
    return this.http.post(this.baseUrl + "/eliminarJuego", body, { headers });
  }
  
  public obtenerDatosFormulario(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/obtenerDatosFormulario", {headers});
  }

  public agregarJuego(juegoData: any): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.post(this.baseUrl + "/agregarJuego", juegoData, { headers })
  }

    public crearAdministrador(adminData: any): Observable<any>{
      const headers = new HttpHeaders({
        'Authorization': this.authorizationKey,
        'Token': this.apiToken
      });

      return this.http.post(this.baseUrl + "/crearAdministrador", adminData, { headers })
  }

  public editarJuego(juegoData: any): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.post(this.baseUrl + "/editarJuego", juegoData, { headers })
  }

  public actualizarDatosAPI(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/actualizarDatosAPI", {headers});
  }

  public recibirJuegosAdmin(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/recibirJuegosAdmin", {headers});
  }

  public purgarDatos(): Observable<any>{
    
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

    return this.http.get(this.baseUrl+"/purgarDatos", {headers});
  }

  public realizarBusqueda(nombre: string): Observable<any>{
    
    console.log('Búsqueda realizada con:', nombre);

    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    const body = { nombre };
  
    return this.http.post(`${this.baseUrl}/realizarBusqueda`, body, { headers });
  }

  public realizarBusquedaDesarrolladoras(nombre: string): Observable<any>{
    
    console.log('Búsqueda realizada con:', nombre);

    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    const body = { nombre };
  
    return this.http.post(`${this.baseUrl}/realizarBusquedaDesarrolladoras`, body, { headers });
  }

  public realizarBusquedaPublishers(nombre: string): Observable<any>{
    
    console.log('Búsqueda realizada con:', nombre);

    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    const body = { nombre };
  
    return this.http.post(`${this.baseUrl}/realizarBusquedaPublishers`, body, { headers });
  }

  public obtenerAppId(nombre: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });
  
    return this.http.get(`${this.baseUrl}/obtenerAppId/${nombre}`, { headers });
  }

}
