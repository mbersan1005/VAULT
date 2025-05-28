import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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

  //Array que contiene todas las desarrolladoras recibidas desde el backend.
  desarrolladoras: any[] = [];

  //Array de desarrolladoras que se muestran en la vista tras aplicar paginación y ordenamiento.
  desarrolladorasFiltradas: any[] = [];

  //Array que almacena los resultados de una búsqueda de desarrolladoras.
  desarrolladorasBuscadas: any[] = [];

  //Valor ingresado en el campo de búsqueda (convertido a minúsculas).
  textoBusqueda: string = '';

  //Número de desarrolladoras actualmente cargadas en la vista.
  desarrolladorasCargadas: number = 9;

  //Número de desarrolladoras que se agregarán cada vez que se activa el scroll infinito.
  desarrolladorasPorCargar: number = 9;

  //Orden actual aplicado a la lista (por ejemplo, 'juegos_desc').
  ordenActual: string = 'juegos_desc';

  //Referencia al componente IonInfiniteScroll para activar o desactivar el scroll.
  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para mostrar toasts y notificaciones.
    private router: Router, //Servicio para la navegación entre rutas.
    private apiFacade: ApiFacade, //Acceso al backend para recuperar datos de desarrolladoras.
    private changeDetector: ChangeDetectorRef, //Permite forzar la actualización manual de la vista.
  ) { }

  //Método que se ejecuta al inicializar el componente y carga la lista inicial de desarrolladoras.
  ngOnInit() {
    this.cargarDesarrolladoras();
  }


  //Método que recupera la lista de desarrolladoras desde la API, ordena la lista y la asigna a la vista.
  public cargarDesarrolladoras() {
    this.apiFacade.recibirDesarrolladoras().subscribe(
      (data) => {
        this.desarrolladoras = data.desarrolladoras;
        const listaOrdenada = this.ordenarJuegos(this.ordenActual, this.desarrolladoras);
        this.desarrolladorasFiltradas = listaOrdenada.slice(0, this.desarrolladorasCargadas);

        //Se vuelve a aplicar el orden para mantener consistencia.
        this.ordenarJuegos(this.ordenActual);
        this.changeDetector.detectChanges();
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  /*
   * Método que ejecuta la búsqueda de desarrolladoras basándose en el texto ingresado. Si el campo queda vacío,
   * se reinicia la lista mostrando todos los resultados. Realiza la búsqueda a través del backend.
   */
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
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  /*
   * Método que incrementa la cantidad de desarrolladoras mostradas al activar el scroll infinito.
   * La función agrega más elementos y, si se han cargado todos, desactiva el scroll.
   */
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


  //Método que navega hacia la lista de juegos filtrada por la categoría y la desarrolladora seleccionada.
  public verJuegosDesarrolladoras(categoria: string, nombre: string) {
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  /*
   * Método que ordena la lista de desarrolladoras basada en el tipo de orden especificado.
   * Permite ordenar por nombre (ascendente o descendente) o por cantidad de juegos.
   */
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


  //Método que retorna una descripción legible del criterio de ordenación actual.
  public obtenerTextoOrdenActual(): string {
    switch (this.ordenActual) {
      case 'nombre_asc': return 'Nombre (A-Z)';
      case 'nombre_desc': return 'Nombre (Z-A)';
      case 'juegos_asc': return 'Cantidad de juegos (Menor a mayor)';
      case 'juegos_desc': return 'Cantidad de juegos (Mayor a menor)';
      default: return 'Ordenar por...';
    }
  }

  //Método que aplica un nuevo criterio de orden a la lista de desarrolladoras y actualiza la vista.
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
