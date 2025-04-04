import { Component } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';  
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-juego',
  templateUrl: 'info-juego.page.html',
  styleUrls: ['info-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  providers: [DatePipe]
})
export class InfoJuegoPage {

  juegoId: number | null = null;
  juego: any = {};

  constructor(
    private menu: MenuController,
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.juegoId = idParam ? parseInt(idParam, 10) : null;

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId);
    } else {
      this.mostrarToast('ID del juego no válido', 'danger');
    }
  }

  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        console.log('Datos del juego recibido desde la API:', data);
        this.juego = data.juego || data;
  
        console.log('Juego cargado:', this.juego);
  
        // Asegúrate de que las propiedades estén correctamente inicializadas
        if (this.juego) {
          this.juego.tiendas = this.parseJsonData(this.juego.tiendas);
          this.juego.plataformas_principales = this.parseJsonData(this.juego.plataformas_principales);
          this.juego.generos = this.parseJsonData(this.juego.generos); 
          this.juego.desarrolladoras = this.parseJsonData(this.juego.desarrolladoras);
          this.juego.publishers = this.parseJsonData(this.juego.publishers);  // Asegúrate de parsear correctamente
  
          console.log('Publishers:', this.juego.publishers);  // Log para verificar
  
          // Asegúrate de inicializar las propiedades si no vienen del servidor
          if (!this.juego.publishers) {
            this.juego.publishers = [];  // Inicializa publishers si no vienen de la API
          }
          if (!this.juego.desarrolladoras) {
            this.juego.desarrolladoras = [];  // Inicializa desarrolladoras si no vienen de la API
          }
          if (!this.juego.generos) {
            this.juego.generos = [];  // Inicializa géneros si no vienen de la API
          }
          if (!this.juego.plataformas_principales) {
            this.juego.plataformas_principales = []; // Inicializa plataformas si no vienen de la API
          }
          if (!this.juego.tiendas) {
            this.juego.tiendas = [];  // Inicializa tiendas si no vienen de la API
          }
        }
  
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar los datos del juego', 'danger');
      }
    );
  }
  
  
  
  
  

  private parseJsonData(data: any): any[] {
    if (!data) return []; 
    try {
      return typeof data === 'string' ? JSON.parse(data) : data; 
    } catch (error) {
      console.error('Error al parsear JSON:', error, data);
      return []; 
    }
  }

  getSitioWeb(sitio: string | null): string {
    if (sitio) {
      return `<a href="${sitio}" target="_blank">${sitio}</a>`;
    } else {
      return 'No establecido';
    }
  }

  public formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha; 
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  getTiendas(tiendas: any[]): string {
    return this.getListAsString(tiendas);
  }
  
  getPlataformas(plataformas: any[]): string {
    return this.getListAsString(plataformas);
  }
  
  getGeneros(generos: any[]): string {
    return this.getListAsString(generos);
  }
  
  getDesarrolladoras(desarrolladoras: any[]): string {
    return this.getListAsString(desarrolladoras);
  }
  
  getPublishers(publishers: any[]): string {
    return this.getListAsString(publishers);
  }
  
  private getListAsString(items: any[]): string {
    if (items && items.length > 0) {
      return items.map((item: { nombre: string }) => item.nombre).join(', ');
    } else {
      return 'No disponible';
    }
  }
  
  isLastItem(array: any[], item: any): boolean {
    return array[array.length - 1] === item;
  }
  
  
}
