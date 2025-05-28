import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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

  //Array que almacena todos los publishers obtenidos de la API
  publishers: any[] = [];
  
  //Array que contiene los publishers que se mostrarán actualmente (paginados)
  publishersFiltrados: any[] = [];
  
  //Array que almacena los publishers resultado de una búsqueda
  publishersBuscados: any[] = [];
  
  //Texto ingresado en el campo de búsqueda (convertido a minúsculas)
  textoBusqueda: string = '';
  
  //Número inicial de publishers cargados en la vista
  publishersCargados: number = 9;
  
  //Número de publishers que se cargarán en cada evento de scroll infinito
  publishersPorCargar: number = 9;
  
  //Orden actual aplicado a la lista de publishers (por ejemplo, 'juegos_desc')
  ordenActual: string = 'juegos_desc';

  //Referencia al componente IonInfiniteScroll para controlarlo dinámicamente
  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para mostrar mensajes y notificaciones al usuario
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
    private changeDetector: ChangeDetectorRef, //Permite actualizar la vista manualmente
  ) { }

  //Método que inicializa el componente y carga la lista de publishers
  ngOnInit() {
    this.cargarPublishers();
  }

  //Método que recupera los publishers desde la API, los ordena y actualiza la vista
  public cargarPublishers() {
    this.apiFacade.recibirPublishers().subscribe(
      (data) => {
        this.publishers = data.publishers; //Asigna la lista completa de publishers
        const listaOrdenada = this.ordenarJuegos(this.ordenActual, this.publishers); //Ordena la lista según el orden actual
        this.publishersFiltrados = listaOrdenada.slice(0, this.publishersCargados); //Muestra la cantidad inicial según la paginación
        this.ordenarJuegos(this.ordenActual); //Aplica el orden de forma global (para mantener consistencia)
        this.changeDetector.detectChanges(); //Actualiza la vista para reflejar los cambios
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }
  
  //Método que ejecuta la búsqueda de publishers según el texto ingresado en el input
  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; //Convierte el texto a minúsculas y lo asigna

    if (this.textoBusqueda.trim() === '') {
      //Si el campo de búsqueda está vacío, reinicia la lista de resultados y la paginación
      this.publishersBuscados = [];
      this.publishersCargados = 9;
      this.publishersFiltrados = this.ordenarJuegos(this.ordenActual, this.publishers).slice(0, this.publishersCargados);
      
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false; //Habilita el scroll infinito
      }
      
      return;
    }
  
    //Realiza la búsqueda a través de la API según el texto ingresado
    this.apiFacade.realizarBusquedaPublishers(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.publishers || [];
        this.publishersBuscados = resultados; //Almacena los publishers encontrados
        this.publishersCargados = 9; //Reinicia la cantidad de publishers mostrados
        this.publishersFiltrados = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.publishersCargados);
  
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false; //Habilita el scroll infinito después de la búsqueda
        }
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }

  //Método que incrementa la cantidad de publishers mostrados al activar el scroll infinito
  public cargarMasPublishers(event: any) {
    setTimeout(() => {
      this.publishersCargados += this.publishersPorCargar; //Incrementa el contador de publishers cargados
  
      let fuenteDatos: any[] = [];
  
      //Selecciona la fuente de datos correcta: publisher resultado de búsqueda o lista completa
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.publishersBuscados];
      } else {
        fuenteDatos = [...this.publishers];
      }
  
      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos); //Ordena la fuente de datos según el orden actual
      this.publishersFiltrados = fuenteDatos.slice(0, this.publishersCargados); //Actualiza la lista de publishers mostrados
  
      event.target.complete(); //Indica que la carga adicional ha finalizado
  
      //Si se han cargado todos los publishers disponibles, deshabilita el scroll infinito
      if (this.publishersCargados >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
  
  //Método que navega a la lista de juegos filtrada por el publisher seleccionado
  public verJuegosPublisher(categoria: string, nombre: string) {
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }
  
  //Método que ordena la lista de publishers según el tipo de orden establecido
  public ordenarJuegos(tipoOrden: string, lista: any[] = []) {
    this.ordenActual = tipoOrden;
  
    if (lista.length === 0) {
      //Si no se proporciona una lista, determina la fuente de datos en función del campo de búsqueda
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
  
  //Método que retorna una descripción legible del orden actual aplicado
  public obtenerTextoOrdenActual(): string {
    switch (this.ordenActual) {
      case 'nombre_asc': return 'Nombre (A-Z)';
      case 'nombre_desc': return 'Nombre (Z-A)';
      case 'juegos_asc': return 'Cantidad de juegos (Menor a mayor)';
      case 'juegos_desc': return 'Cantidad de juegos (Mayor a menor)';
      default: return 'Ordenar por...';
    }
  }

  //Método que aplica un nuevo orden a la lista de publishers y actualiza la vista
  public aplicarOrden(nuevoOrden: string) {
    this.ordenActual = nuevoOrden;
  
    const fuenteDatos = this.textoBusqueda.trim() !== ''
      ? [...this.publishersBuscados]
      : [...this.publishers];
  
    const ordenados = this.ordenarJuegos(nuevoOrden, fuenteDatos);
    this.publishersFiltrados = ordenados.slice(0, this.publishersCargados);
  
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false; //Habilita el scroll infinito tras cambiar el orden
    }
  }
}
