import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { SesionService } from 'src/app/services/sesion.service';

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
  juegosBuscados: any[] = [];  
  textoBusqueda: string = '';
  juegosCargados: number = 9;
  juegosPorCargar: number = 9;
  categoria: string = '';
  nombre: string = '';
  ordenActual: string ='nombre_asc';

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiFacade: ApiFacade,
    private toastController: ToastController,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private alertController: AlertController,
    public sesion: SesionService,
    
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
          this.ordenarJuegos(this.ordenActual);
          this.changeDetector.detectChanges(); 
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
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; 
    
    if (this.textoBusqueda.trim() === '') {
      this.juegosBuscados = [];
      this.juegosCargados = 9;
  
      this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, this.juegos).slice(0, this.juegosCargados);
  
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false;
      }
  
      return;
    }
  
    this.apiFacade.realizarBusqueda(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.juegos || [];
  
        this.juegosBuscados = resultados;
        this.juegosCargados = 9;
  
        this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.juegosCargados);
  
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
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
  
      let fuenteDatos: any[] = [];
  
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.juegosBuscados];
      } else {
        fuenteDatos = [...this.juegos];
      }
  
      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos);
      
      this.juegosFiltrados = fuenteDatos.slice(0, this.juegosCargados);
  
      event.target.complete();
  
      if (this.juegosCargados >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  public verJuego(juegoId: number) {
    this.router.navigate(['/info-juego', juegoId]);
  }

  public editarJuego(juegoId: number){
    this.router.navigate(['/editar-juego', juegoId]);
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

  public ordenarJuegos(tipoOrden: string, lista: any[] = []) {
    this.ordenActual = tipoOrden;
  
    if (lista.length === 0) {
      lista = this.textoBusqueda.trim() !== ''
        ? [...this.juegosBuscados]
        : [...this.juegos];
    }
  
    switch (tipoOrden) {
      case 'nombre_asc':
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre_desc':
        lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'fecha_asc':
        lista.sort((a, b) => new Date(a.fecha_lanzamiento).getTime() - new Date(b.fecha_lanzamiento).getTime());
        break;
      case 'fecha_desc':
        lista.sort((a, b) => new Date(b.fecha_lanzamiento).getTime() - new Date(a.fecha_lanzamiento).getTime());
        break;
      case 'nota_asc':
        lista.sort((a, b) => a.nota_metacritic - b.nota_metacritic);
        break;
      case 'nota_desc':
        lista.sort((a, b) => b.nota_metacritic - a.nota_metacritic);
        break;
    }
  
    return lista;
  }
  
  public obtenerTextoOrdenActual(): string {
    switch (this.ordenActual) {
      case 'nombre_asc': return 'Nombre (A-Z)';
      case 'nombre_desc': return 'Nombre (Z-A)';
      case 'fecha_asc': return 'Fecha (Antiguos primero)';
      case 'fecha_desc': return 'Fecha (Recientes primero)';
      case 'nota_asc': return 'Nota (Menor a mayor)';
      case 'nota_desc': return 'Nota (Mayor a menor)';
      default: return 'Ordenar por...';
    }
  }

  public async eliminarJuego(juegoId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este juego?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.apiFacade.eliminarJuego(juegoId).subscribe(
              (data) => {
                console.log('Juego eliminado:', data);
                
                this.juegos = this.juegos.filter(juego => juego.id !== juegoId);
                this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
  
                this.mostrarToast('Juego eliminado correctamente', 'success');
              },
              (error) => {
                console.error('Error al eliminar el juego:', error);
                this.mostrarToast('Error al eliminar el juego', 'danger');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }

  public aplicarOrden(nuevoOrden: string) {
    this.ordenActual = nuevoOrden;
  
    const fuenteDatos = this.textoBusqueda.trim() !== ''
      ? [...this.juegosBuscados]
      : [...this.juegos];
  
    const ordenados = this.ordenarJuegos(nuevoOrden, fuenteDatos);
    this.juegosFiltrados = ordenados.slice(0, this.juegosCargados);

    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    
  }
}
