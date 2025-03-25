import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

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

  public recibirJuegoAppID(juegoNombre: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': this.authorizationKey,
      'Token': this.apiToken
    });

      // Sanitize the game name to ensure it is correctly formatted for the URL
  const nombreSanitizado = encodeURIComponent(juegoNombre);

  // Ahora la URL debería estar correctamente formateada
  return this.http.get(`${this.baseUrl}/recibirAppID/${nombreSanitizado}`, { headers });

  }
  
}
