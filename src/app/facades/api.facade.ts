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

}
