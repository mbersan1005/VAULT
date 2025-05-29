import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-info-juego',
  templateUrl: 'info-juego.page.html',
  styleUrls: ['info-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  providers: [DatePipe]
})
export class InfoJuegoPage {

  //ID del juego obtenido de la URL
  juegoId: number | null = null;
  
  //Objeto que almacenará los datos del juego
  juego: any = {};
  
  //URL segura para el iframe embebido (SteamDB)
  iframeSrc: SafeResourceUrl | null = null;

  /*CONSTRUCTOR*/
  constructor(
    private apiFacade: ApiFacade, //Servicio para comunicarse con la API
    public apiRequestService: ApiRequestService, //Servicio para realizar peticiones HTTP
    private ui: UiService, //Servicio para mostrar mensajes al usuario
    private route: ActivatedRoute, //Permite acceder a los parámetros de la ruta
    private sanitizer: DomSanitizer, //Servicio para sanitizar URLs
  ) { }

  //Método que inicializa el componente y carga los datos del juego si el ID es válido
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id'); //Obtiene el parámetro "id" de la URL
    this.juegoId = idParam ? parseInt(idParam, 10) : null; //Convierte el parámetro a número

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId); //Carga los datos del juego
    }
  }

  //Método que recupera los datos del juego desde la API y los asigna a la variable "juego"
  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        this.juego = data.juego || data; //Asigna la respuesta a "juego"

        //Parsea los datos JSON para cada propiedad del juego
        this.juego.tiendas = this.ui.parseJsonData(this.juego.tiendas);
        this.juego.plataformas_principales = this.ui.parseJsonData(this.juego.plataformas_principales);
        this.juego.generos = this.ui.parseJsonData(this.juego.generos);
        this.juego.desarrolladoras = this.ui.parseJsonData(this.juego.desarrolladoras);
        this.juego.publishers = this.ui.parseJsonData(this.juego.publishers);

        //Asegura que las propiedades sean arrays si no contienen datos
        this.juego.publishers = this.juego.publishers || [];
        this.juego.desarrolladoras = this.juego.desarrolladoras || [];
        this.juego.generos = this.juego.generos || [];
        this.juego.plataformas_principales = this.juego.plataformas_principales || [];
        this.juego.tiendas = this.juego.tiendas || [];

        //Si el juego tiene un nombre, se intenta obtener su AppID para configurar el iframe
        if (this.juego.nombre) {
          this.apiFacade.obtenerAppId(this.juego.nombre).subscribe(
            (res) => {
              if (res?.appid) {
                this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://steamdb.info/embed/?appid=${res.appid}`
                );
              } else {
                this.iframeSrc = null;
              }
            },
            (err) => {
              this.ui.mostrarRespuestaError(err, 'Operación errónea'); //Notifica el error al usuario
              this.iframeSrc = null;
            }
          );
        }
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }

  //Método que retorna un enlace HTML si el sitio está definido; caso contrario, retorna "No establecido"
  getSitioWeb(sitio: string | null): string {
    if (sitio) {
      return `<a href="${sitio}" target="_blank">${sitio}</a>`;
    } else {
      return 'No establecido';
    }
  }

  //Método que utiliza el servicio UI para formatear la fecha
  formatearFecha(fecha: string): string {
    return this.ui.formatearFecha(fecha);
  }

  //Método que verifica si un elemento es el último en un array dado
  isLastItem(array: any[], item: any): boolean {
    return array[array.length - 1] === item;
  }

}
