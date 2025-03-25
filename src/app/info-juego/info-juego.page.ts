import { Component } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../facades/api.facade';
import { ApiRequestService } from '../requests/api.requests';
import { DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';  
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  juegoAppID: number | null = null;

  constructor(
    private menu: MenuController,
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.juegoId = idParam ? parseInt(idParam, 10) : null;

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId);
      this.obtenerAppID(this.juego.nombre);
    } else {
      this.mostrarToast('ID del juego no válido', 'danger');
    }
  }
  
  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        console.log('Datos del juego recibido desde la API:', data);
        this.juego = data.juego || data;
  
        console.log('Juego cargado:', this.juego);  // Verifica que 'nombre' está en el objeto
  
        // Verificar que 'juego.nombre' no es undefined
        if (this.juego && this.juego.nombre) {
          console.log('Nombre del juego:', this.juego.nombre);  // Verificar el valor de nombre antes de llamar a la API
          this.obtenerAppID(this.juego.nombre);
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
  
<<<<<<< HEAD
  
  
  private parseJsonData(data: any): any[] {
    if (!data) return []; 
  
    try {
      return typeof data === 'string' ? JSON.parse(data) : data; 
    } catch (error) {
      console.error('Error al parsear JSON:', error, data);
      return []; 
    }
=======
  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson); 
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
>>>>>>> parent of a451056 (Errores de parsear JSON de Info-juego corregido)
  }

  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
  }

  getDesarrolladoras(desarrolladorasJson: string): string{
    const desarrolladoras = JSON.parse(desarrolladorasJson);
    return desarrolladoras.map((desarrolladora: { nombre: any}) => desarrolladora.nombre).join(', ');
  }

  getPublishers(publishersJson: string): string{
    const publishers = JSON.parse(publishersJson);
    return publishers.map((publisher: { nombre: any}) => publisher.nombre).join(', ');
  }

  getTiendas(tiendasJson: string): string{
    const tiendas = JSON.parse(tiendasJson);
    return tiendas.map((tienda: { nombre: any}) => tienda.nombre).join(', ');
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

  obtenerAppID(juegoNombre: string) {
    this.apiFacade.recibirJuegoAppID(juegoNombre).subscribe(
      (data: number) => {  
        console.log('AppID recibido desde la API:', data);
        this.juegoAppID = data || null;

      },
      (error: any) => {
        console.error('Error al obtener el AppID:', error);
        this.mostrarToast('Error al cargar la gráfica', 'danger');
      }
    );
  }


}
