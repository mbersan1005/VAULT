import { ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-desarrolladoras',
  templateUrl: './desarrolladoras.page.html',
  styleUrls: ['./desarrolladoras.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class DesarrolladorasPage {

  desarrolladoras: any[] = [];
  desarrolladorasFiltradas: any[] = [];
  desarrolladorasBuscadas: any[] = [];  
  textoBusqueda: string = '';
  desarrolladorasCargadas: number = 9;
  desarrolladorasPorCargar: number = 9;
  ordenActual: string ='juegos_desc';

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  constructor(
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
    private changeDetector: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.cargarDesarrolladoras();
  }

  public cargarDesarrolladoras() {
    this.apiFacade.recibirDesarrolladoras().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
          this.desarrolladoras = data.desarrolladoras;
          this.desarrolladorasFiltradas = this.desarrolladoras.slice(0, this.desarrolladorasCargadas);
          this.ordenarJuegos(this.ordenActual);
          this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || '';  
  
    if (this.textoBusqueda.trim() === '') {
      this.desarrolladorasBuscadas = [];
      this.desarrolladorasCargadas = 9;
  
      this.desarrolladorasFiltradas = this.ordenarJuegos(this.ordenActual, this.desarrolladoras).slice(0, this.desarrolladorasCargadas);
  
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false;
      }
  
      return;
    }
  
    this.apiFacade.realizarBusquedaDesarrolladoras(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.desarrolladoras || [];
  
        this.desarrolladorasBuscadas = resultados;
        this.desarrolladorasCargadas = 9;
        this.desarrolladorasFiltradas = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.desarrolladorasCargadas);
  
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
      },
      (error) => {
        console.error('Error al buscar:', error);
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }
  
  public cargarMasDesarrolladoras(event: any) {
    setTimeout(() => {
      this.desarrolladorasCargadas += this.desarrolladorasPorCargar;
  
      let fuenteDatos: any[] = [];
  
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.desarrolladorasBuscadas];
      } else {
        fuenteDatos = [...this.desarrolladoras];
      }
  
      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos);
      
      this.desarrolladorasFiltradas = fuenteDatos.slice(0, this.desarrolladorasCargadas);
  
      event.target.complete();
  
      if (this.desarrolladorasCargadas >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
  
  public verJuegosDesarrolladoras(categoria: string, nombre: string){
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  public ordenarJuegos(tipoOrden: string, lista: any[] = []) {
    this.ordenActual = tipoOrden;
  
    if (lista.length === 0) {
      lista = this.textoBusqueda.trim() !== ''
        ? [...this.desarrolladorasBuscadas]
        : [...this.desarrolladoras];
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
      ? [...this.desarrolladorasBuscadas]
      : [...this.desarrolladoras];
  
    const ordenados = this.ordenarJuegos(nuevoOrden, fuenteDatos);
    this.desarrolladorasFiltradas = ordenados.slice(0, this.desarrolladorasCargadas);

    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    
  }
  
}
