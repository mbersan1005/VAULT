import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../facades/api.facade';
import { ApiRequestService } from '../requests/api.requests';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class HomePage {

  juegos: any[] = [];
  juegosFiltrados: any[] = []; 
  searchText: string = ''; 
  juegosCargados: number = 6; 
  juegosPorCargar: number = 6;

  constructor(
    private menu: MenuController, 
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
    private datePipe: DatePipe
  ) {}

  ngOnInit(){
    this.cargarJuegos();
  }

  openPage(page: string) {
    if (page === 'home') {
      this.router.navigate(['/home']);
    } else if (page === 'profile') {
      //this.router.navigate(['/profile']);
    }
    this.menu.close();
  }

  public cargarJuegos() {
    this.apiFacade.recibirJuegos().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);
        if (data && data.juegos && data.juegos.length > 0) {
          this.juegos = data.juegos;  
          this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados); 
        } else {
          this.mostrarToast('No se encontraron datos', 'danger');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar los datos', 'danger');
      }
    );
  }

  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson); 
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
  }

  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
  }

  public realizarBusqueda(event: any) {
    const query = event.target.value?.toLowerCase() || ''; 
    if (query.trim() === '') {
      this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados); 
    } else {
      this.juegosFiltrados = this.juegos.filter(juego =>
        juego.nombre?.toLowerCase().includes(query)
      ).slice(0, this.juegosCargados);
    }
  }

  public cargarMasJuegos(event: any) {
    setTimeout(() => {
      this.juegosCargados += this.juegosPorCargar;
      
      if (this.searchText.trim() === '') {
        this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
      } else {
        this.juegosFiltrados = this.juegos.filter(juego =>
          juego.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
        ).slice(0, this.juegosCargados);
      }

      event.target.complete();

      if (this.juegosCargados >= this.juegos.length) {
        event.target.disabled = true;
      }
    }, 500);
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

  public verJuego(JuegoId: number){
    this.router.navigate(['/info-juego', JuegoId]);
  }

}
