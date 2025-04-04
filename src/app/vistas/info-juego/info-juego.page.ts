import { Component } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';  
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-juego',
  templateUrl: 'info-juego.page.html',
  styleUrls: ['info-juego.page.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [DatePipe]
})
export class InfoJuegoPage {

  juegoId: number | null = null;
  juego: any = [];

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
  
        if (this.juego && this.juego.nombre) {
          console.log('Nombre del juego:', this.juego.nombre);  
        } else {
          console.error('Nombre del juego no disponible');
          this.mostrarToast('Nombre del juego no disponible', 'danger');
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
  
  getPlataformas(plataformasJson: any): string {
    const plataformas = this.parseJsonData(plataformasJson);
    return plataformas.length > 0 ? plataformas.map((p: { nombre: string }) => p.nombre).join(', ') : 'No disponible';
  }
  
  getGeneros(generosJson: any): string {
    const generos = this.parseJsonData(generosJson);
    return generos.length > 0 ? generos.map((g: { nombre: string }) => g.nombre).join(', ') : 'No disponible';
  }
  
  getDesarrolladoras(desarrolladorasJson: any): string {
    const desarrolladoras = this.parseJsonData(desarrolladorasJson);
    return desarrolladoras.length > 0 ? desarrolladoras.map((d: { nombre: string }) => d.nombre).join(', ') : 'No disponible';
  }
  
  getPublishers(publishersJson: any): string {
    const publishers = this.parseJsonData(publishersJson);
    return publishers.length > 0 ? publishers.map((p: { nombre: string }) => p.nombre).join(', ') : 'No disponible';
  }
  
  getTiendas(tiendasJson: any): string {
    const tiendas = this.parseJsonData(tiendasJson);
    return tiendas.length > 0 ? tiendas.map((t: { nombre: string }) => t.nombre).join(', ') : 'No disponible';
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

}
