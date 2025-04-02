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

}
