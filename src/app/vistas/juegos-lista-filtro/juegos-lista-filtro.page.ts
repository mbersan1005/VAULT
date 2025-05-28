import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-juegos-lista-filtro',
  templateUrl: './juegos-lista-filtro.page.html',
  styleUrls: ['./juegos-lista-filtro.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  providers: [DatePipe]
})
export class JuegosListaFiltroPage {

  //Array que almacena todos los juegos recibidos de la API
  juegos: any[] = [];
  
  //Array que contiene los juegos a mostrar según la paginación
  juegosFiltrados: any[] = [];
  
  //Array que almacena los resultados de búsqueda de juegos
  juegosBuscados: any[] = [];  
  
  //Texto ingresado en el campo de búsqueda
  textoBusqueda: string = '';
  
  //Número inicial de juegos cargados en la vista
  juegosCargados: number = 9;
  
  //Número de juegos que se cargarán en cada acción del scroll infinito
  juegosPorCargar: number = 9;
  
  //Categoría de juegos, obtenida de los parámetros de la URL
  categoria: string = '';
  
  //Nombre relacionado a la categoría, también obtenido de los parámetros de la URL
  nombre: string = '';
  
  //Orden actual aplicado a la lista de juegos
  ordenActual: string = 'nombre_asc';

  //Referencia al componente IonInfiniteScroll para controlarlo dinámicamente
  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  /*CONSTRUCTOR*/
  constructor(
    private route: ActivatedRoute, //Permite acceder a los parámetros de la ruta
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
    private ui: UiService, //Servicio para mostrar mensajes y notificaciones
    private changeDetector: ChangeDetectorRef, //Permite actualizar la vista manualmente
    private alertController: AlertController, //Controla la presentación de alertas de confirmación
    public sesion: SesionService, //Servicio relacionado con la sesión del usuario
  ) { }

  //Método que se suscribe a los parámetros de la ruta y carga los juegos filtrados por categoría
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria')!; //Asigna la categoría recibida por la URL
      this.nombre = params.get('nombre')!; //Asigna el nombre recibido por la URL
      this.cargarJuegosPorCategoria(); //Llama al método para cargar los juegos filtrados
    });
  }

  //Método que recupera los juegos de una categoría específica desde la API
  public cargarJuegosPorCategoria() {
    this.apiFacade.recibirJuegosPorCategoria(this.categoria, this.nombre).subscribe(
      (data) => {
        this.juegos = data.juegosFiltrados; //Asigna los juegos obtenidos a la variable "juegos"
        this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados); //Configura la paginación inicial
        this.ordenarJuegos(this.ordenActual); //Aplica el orden actual a la lista de juegos
        this.changeDetector.detectChanges(); //Fuerza la actualización de la vista
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }
  
  //Método que ejecuta una búsqueda de juegos según el texto ingresado por el usuario
  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; //Convierte el texto a minúsculas

    if (this.textoBusqueda.trim() === '') {
      //Si no hay texto de búsqueda, reinicia la lista y la paginación de los juegos
      this.juegosBuscados = [];
      this.juegosCargados = 9;
      this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, this.juegos).slice(0, this.juegosCargados);
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false; //Habilita el scroll infinito
      }
      return;
    }
  
    //Realiza la búsqueda a través de la API
    this.apiFacade.realizarBusqueda(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.juegos || [];
        this.juegosBuscados = resultados; //Asigna los resultados obtenidos de la búsqueda
        this.juegosCargados = 9; //Reinicia la cantidad de juegos mostrados
        this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.juegosCargados);
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false; //Habilita nuevamente el scroll infinito
        }
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }
  
  //Método que incrementa la cantidad de juegos mostrados al activar el scroll infinito
  public cargarMasJuegos(event: any) {
    setTimeout(() => {
      this.juegosCargados += this.juegosPorCargar; //Incrementa la cantidad de juegos cargados

      let fuenteDatos: any[] = [];
      //Selecciona la fuente de datos correcta: resultados de búsqueda o lista completa
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.juegosBuscados];
      } else {
        fuenteDatos = [...this.juegos];
      }
  
      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos); //Aplica el orden a la fuente de datos
      this.juegosFiltrados = fuenteDatos.slice(0, this.juegosCargados); //Actualiza la lista de juegos mostrados
  
      event.target.complete(); //Informa que la carga adicional ha finalizado
  
      //Si se han cargado todos los juegos disponibles, deshabilita el scroll infinito
      if (this.juegosCargados >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  //Método que navega a la página de detalle del juego seleccionado
  public verJuego(juegoId: number) {
    this.router.navigate(['/info-juego', juegoId]);
  }

  //Método que navega a la página de edición del juego seleccionado
  public editarJuego(juegoId: number) {
    this.router.navigate(['/editar-juego', juegoId]);
  }

  //Método que convierte un JSON de plataformas en una cadena de nombres separados por comas
  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson);
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
  }

  //Método que convierte un JSON de géneros en una cadena de nombres separados por comas
  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
  }

  //Método que formatea una fecha utilizando el servicio UiService
  formatearFecha(fecha: string): string {
    return this.ui.formatearFecha(fecha);
  }

  //Método que ordena la lista de juegos según el tipo de orden especificado
  public ordenarJuegos(tipoOrden: string, lista: any[] = []) {
    this.ordenActual = tipoOrden;
  
    if (lista.length === 0) {
      //Si no se provee una lista, utiliza los datos de búsqueda o la lista completa de juegos
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
  
  //Método que retorna una descripción legible del orden actual aplicado a la lista de juegos
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

  //Método que solicita confirmación para eliminar un juego y lo elimina utilizando la API
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
                //Remueve el juego eliminado de la lista global
                this.juegos = this.juegos.filter(juego => juego.id !== juegoId);
                this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
                this.ui.mostrarRespuestaExitosa(data, 'Operación exitosa');
              },
              (error) => {
                this.ui.mostrarRespuestaError(error, 'Operación errónea');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }

  //Método que aplica un nuevo orden a la lista de juegos y actualiza la vista
  public aplicarOrden(nuevoOrden: string) {
    this.ordenActual = nuevoOrden;
  
    const fuenteDatos = this.textoBusqueda.trim() !== ''
      ? [...this.juegosBuscados]
      : [...this.juegos];
  
    const ordenados = this.ordenarJuegos(nuevoOrden, fuenteDatos);
    this.juegosFiltrados = ordenados.slice(0, this.juegosCargados);
  
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false; //Habilita el scroll infinito tras cambiar el orden
    }
  }
}
