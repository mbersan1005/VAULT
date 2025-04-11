import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';

@Component({
  selector: 'app-juegos-lista-filtro',
  templateUrl: './juegos-lista-filtro.page.html',
  styleUrls: ['./juegos-lista-filtro.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  providers: [DatePipe]
})
export class JuegosListaFiltroPage {

  juegos: any[] = [];
  juegosFiltrados: any[] = [];
  textoBusqueda: string = '';
  juegosCargados: number = 9;
  juegosPorCargar: number = 9;
  categoria: string = '';
  nombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiFacade: ApiFacade,
    private toastController: ToastController,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria')!;
      this.nombre = params.get('nombre')!;
      this.cargarJuegosPorCategoria();
    });
  }

  public cargarJuegosPorCategoria() {
    this.apiFacade.recibirJuegosPorCategoria(this.categoria, this.nombre).subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
  
        if (data && data.juegosFiltrados && data.juegosFiltrados.length > 0) {
          this.juegos = data.juegosFiltrados; 
          this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados); 
        } else {
          console.log('No se encontraron juegos');
          this.mostrarToast('No se encontraron juegos', 'danger'); 
        }
      },
      (error) => {
        console.error('Error al obtener datos:', error);
        this.mostrarToast('Error al cargar los datos', 'danger'); 
      }
    );
  }
  

  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || '';  // Usamos textoBusqueda aquí
    
    if (this.textoBusqueda.trim() === '') {
      this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
      return;
    }
  
    this.apiFacade.realizarBusqueda(this.textoBusqueda).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);
        this.juegosFiltrados = response.juegos || [];
        this.juegosCargados = 9;
      },
      (error) => {
        console.error('Error al buscar:', error);
        this.mostrarToast('Error en la búsqueda', 'danger');
      }
    );
  }
  
  public cargarMasJuegos(event: any) {
    setTimeout(() => {
      this.juegosCargados += this.juegosPorCargar;
  
      if (this.textoBusqueda.trim() !== '') {
        this.juegosFiltrados = this.juegosFiltrados.slice(0, this.juegosCargados);
      } else {
        this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
      }
  
      event.target.complete();
  
      if (this.juegosCargados >= (this.textoBusqueda.trim() !== '' ? this.juegosFiltrados.length : this.juegos.length)) {
        event.target.disabled = true;
      }
    }, 500);
  }

  public verJuego(juegoId: number) {
    this.router.navigate(['/info-juego', juegoId]);
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

  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson); 
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
  }

  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
  }

  public formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha; 
  }
}
