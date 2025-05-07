import { ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.page.html',
  styleUrls: ['./publishers.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class PublishersPage {

  publishers: any[] = [];
  publishersFiltrados: any[] = [];
  publishersBuscados: any[] = [];  
  textoBusqueda: string = '';
  publishersCargados: number = 9;
  publishersPorCargar: number = 9;
  ordenActual: string ='juegos_desc';

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;
  
  constructor(
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.cargarPublishers();
  }

  public cargarPublishers() {
    this.apiFacade.recibirPublishers().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
        if (data && data.publishers && data.publishers.length > 0) {
          this.publishers = data.publishers;
          this.publishersFiltrados = this.publishers.slice(0, this.publishersCargados);
          this.ordenarJuegos(this.ordenActual);
          this.changeDetector.detectChanges();
        } else {
          this.ui.mostrarToast('No se encontraron datos', 'dark');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarToast('Error al cargar los datos', 'dark');
      }
    );
  }
  
  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || '';  
    
    if (this.textoBusqueda.trim() === '') {
      this.publishersBuscados = [];
      this.publishersCargados = 9;
  
      this.publishersFiltrados = this.ordenarJuegos(this.ordenActual, this.publishers).slice(0, this.publishersCargados);
  
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false;
      }
  
      return;
    }
  
    this.apiFacade.realizarBusquedaPublishers(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.publishers || [];
  
        this.publishersBuscados = resultados;
        this.publishersCargados = 9;
  
        this.publishersFiltrados = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.publishersCargados);
  
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
      },
      (error) => {
        console.error('Error al buscar:', error);
        this.ui.mostrarToast('Error en la búsqueda', 'dark');
      }
    );
  }

  public cargarMasPublishers(event: any) {
    setTimeout(() => {
      this.publishersCargados += this.publishersPorCargar;
  
      let fuenteDatos: any[] = [];
  
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.publishersBuscados];
      } else {
        fuenteDatos = [...this.publishers];
      }
  
      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos);
      
      this.publishersFiltrados = fuenteDatos.slice(0, this.publishersCargados);
  
      event.target.complete();
  
      if (this.publishersCargados >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  public verJuegosPublisher(categoria: string, nombre: string){
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }
  
  public ordenarJuegos(tipoOrden: string, lista: any[] = []) {
    this.ordenActual = tipoOrden;
  
    if (lista.length === 0) {
      lista = this.textoBusqueda.trim() !== ''
        ? [...this.publishersBuscados]
        : [...this.publishers];
    }
  
    switch (tipoOrden) {
      case 'nombre_asc':
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre_desc':
        lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'juegos_asc':
        lista.sort((a, b) => a.cantidad_juegos - b.cantidad_juegos);
        break;
      case 'juegos_desc':
        lista.sort((a, b) => b.cantidad_juegos - a.cantidad_juegos);
        break;
    }
  
    return lista;
  }
  
  public obtenerTextoOrdenActual(): string {
    switch (this.ordenActual) {
      case 'nombre_asc': return 'Nombre (A-Z)';
      case 'nombre_desc': return 'Nombre (Z-A)';
      case 'juegos_asc': return 'Cantidad de juegos (Menor a mayor)';
      case 'juegos_desc': return 'Cantidad de juegos (Mayor a menor)';
      default: return 'Ordenar por...';
    }
  }

  public aplicarOrden(nuevoOrden: string) {
    this.ordenActual = nuevoOrden;
  
    const fuenteDatos = this.textoBusqueda.trim() !== ''
      ? [...this.publishersBuscados]
      : [...this.publishers];
  
    const ordenados = this.ordenarJuegos(nuevoOrden, fuenteDatos);
    this.publishersFiltrados = ordenados.slice(0, this.publishersCargados);

    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    
  }

}
