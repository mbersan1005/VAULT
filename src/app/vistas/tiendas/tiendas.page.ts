import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.page.html',
  styleUrls: ['./tiendas.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class TiendasPage {

  //Array para almacenar todas las tiendas recibidas desde la API
  tiendas: any[] = [];

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para mostrar mensajes y notificaciones al usuario
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
  ) { }

  //Método que inicializa el componente y carga las tiendas
  ngOnInit() {
    this.cargarTiendas();
  }

  //Método que recupera las tiendas desde la API y las asigna a la variable "tiendas"
  public cargarTiendas() {
    this.apiFacade.recibirTiendas().subscribe(
      (data) => {
        this.tiendas = data.tiendas; //Asigna las tiendas recibidas
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }

  //Método que navega a la lista de juegos filtrada por la tienda seleccionada
  public verJuegosTienda(categoria: string, nombre: string) {
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  //Método que asegura que el dominio tenga el prefijo "https://"
  getUrlCompleta(dominio: string): string {
    if (dominio && !dominio.startsWith('http')) {
      return 'https://' + dominio;
    }
    return dominio;
  }
}
