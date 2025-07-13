import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { CrearAdminModalComponent } from 'src/app/components/crear-admin-modal/crear-admin-modal.component';
import { PurgarDatosComponent } from 'src/app/components/purgar-datos/purgar-datos.component';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class HomePage {

  //Array para almacenar los juegos recibidos desde la API
  juegos: any[] = [];

  //Array para almacenar los juegos filtrados y ordenados según la vista actual
  juegosFiltrados: any[] = [];

  //Array para almacenar los juegos resultado de una búsqueda
  juegosBuscados: any[] = [];

  //Texto de búsqueda ingresado por el usuario
  textoBusqueda: string = '';

  //Número de juegos actualmente cargados en la vista
  juegosCargados: number = 9;

  //Número de juegos que se cargarán en cada evento de scroll infinito
  juegosPorCargar: number = 9;

  //Orden actual de los juegos (por ejemplo, 'nombre_asc')
  ordenActual: string = 'nombre_asc';

  //Indicador de carga (loading)
  isLoading: boolean = false;

  //Referencia al componente IonInfiniteScroll para controlarlo dinámicamente
  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  /*CONSTRUCTOR*/
  constructor(
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
    private modalController: ModalController, //Controla la presentación de modales
    public apiRequestService: ApiRequestService, //Servicio para peticiones HTTP
    private ui: UiService, //Servicio para mostrar mensajes y notificaciones
    public sesion: SesionService, //Servicio para gestionar la sesión del usuario
    private alertController: AlertController, //Controla las alertas de confirmación
    private changeDetector: ChangeDetectorRef //Permite forzar la detección de cambios en la vista
  ) { }

  //Método que inicializa el componente y carga la lista inicial de juegos
  ngOnInit() {
    this.cargarJuegos();
  }

  //Método que recupera los juegos desde la API, los ordena y actualiza la vista
  public cargarJuegos() {
    this.ui.mostrarLoading('Cargando juegos, por favor espere...');
    this.apiFacade.recibirJuegos().subscribe(
      (data) => {
        this.juegos = data.juegos; //Asigna los juegos recibidos
        const juegosOrdenados = this.ordenarJuegos(this.ordenActual, [...this.juegos]); //Ordena los juegos
        this.juegosFiltrados = juegosOrdenados.slice(0, this.juegosCargados); //Limita los juegos a mostrar
        this.changeDetector.detectChanges(); //Actualiza la vista
        this.ui.ocultarLoading();
      },
      (error) => {
        this.ui.ocultarLoading();
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica error al usuario
      }
    );
  }

  //Método que parsea el JSON de plataformas y devuelve una cadena con los nombres separados por comas
  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson);
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
  }

  //Método que parsea el JSON de géneros y devuelve una cadena con los nombres separados por comas
  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
  }

  //Método que ejecuta la búsqueda de juegos según el texto ingresado en el input
  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; //Convierte el texto a minúsculas

    if (this.textoBusqueda.trim() === '') {
      //Si la búsqueda está vacía, reinicia los arrays y la cantidad de juegos cargados
      this.juegosBuscados = [];
      this.juegosCargados = 9;
      this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, this.juegos).slice(0, this.juegosCargados);
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = false;
      }
      return;
    }

    //Si se ingresa texto, realiza la búsqueda a través de la API
    this.apiFacade.realizarBusqueda(this.textoBusqueda).subscribe(
      (response) => {
        const resultados = response.juegos || [];
        this.juegosBuscados = resultados; //Almacena los resultados de búsqueda
        this.juegosCargados = 9; //Reinicia la cantidad de juegos cargados
        this.juegosFiltrados = this.ordenarJuegos(this.ordenActual, resultados).slice(0, this.juegosCargados);
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = false;
        }
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  //Método que incrementa la cantidad de juegos a mostrar y actualiza la vista en el scroll infinito
  public cargarMasJuegos(event: any) {
    setTimeout(() => {
      this.juegosCargados += this.juegosPorCargar; //Incrementa la cantidad de juegos cargados

      let fuenteDatos: any[] = [];

      //Selecciona la fuente de datos según si se realizó una búsqueda o no
      if (this.textoBusqueda.trim() !== '') {
        fuenteDatos = [...this.juegosBuscados];
      } else {
        fuenteDatos = [...this.juegos];
      }

      fuenteDatos = this.ordenarJuegos(this.ordenActual, fuenteDatos); //Ordena los juegos
      this.juegosFiltrados = fuenteDatos.slice(0, this.juegosCargados); //Actualiza la lista filtrada

      event.target.complete(); //Notifica al componente de scroll que finalizó la carga

      //Si se han cargado todos los juegos disponibles, deshabilita el scroll infinito
      if (this.juegosCargados >= fuenteDatos.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  //Método que formatea una fecha utilizando el servicio de UI
  formatearFecha(fecha: string): string {
    return this.ui.formatearFecha(fecha);
  }

  //Método que navega a la página de detalles del juego seleccionado
  public verJuego(juegoId: number) {
    this.router.navigate(['/info-juego', juegoId]);
  }

  //Método que navega a la página para agregar un nuevo juego
  public agregarJuego() {
    this.router.navigate(['/agregar-juego']);
  }

  //Método que navega a la página para editar la información del juego seleccionado
  public editarJuego(juegoId: number) {
    this.router.navigate(['/editar-juego', juegoId]);
  }

  //Método que abre un modal para crear un nuevo administrador
  public async crearAdministrador() {
    const modal = await this.modalController.create({
      component: CrearAdminModalComponent,
      breakpoints: [0.43, 0.53],
      initialBreakpoint: 0.43
    });
    return await modal.present();
  }

  //Método que solicita confirmación para eliminar un juego y, de confirmarse, lo elimina mediante la API
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
                //Filtra el juego eliminado de la lista global
                this.juegos = this.juegos.filter(juego => juego.id !== juegoId);

                if (this.textoBusqueda.trim() !== '') {
                  //Actualiza la lista de resultados de búsqueda y la filtrada
                  this.juegosBuscados = this.juegosBuscados.filter(juego => juego.id !== juegoId);
                  const ordenados = this.ordenarJuegos(this.ordenActual, [...this.juegosBuscados]);
                  this.juegosFiltrados = ordenados.slice(0, this.juegosCargados);
                } else {
                  const ordenados = this.ordenarJuegos(this.ordenActual, [...this.juegos]);
                  this.juegosFiltrados = ordenados.slice(0, this.juegosCargados);
                }

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

  //Método que solicita confirmación para actualizar los datos y, de confirmarse, ejecuta la actualización
  public async actualizarDatosAPI() {
    const alert = await this.alertController.create({
      header: 'Confirmar actualización de Datos',
      message: '¿Estás seguro de que quieres actualizar los datos? Puede conllevar unos minutos',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.ui.mostrarLoading(); //Muestra el loading

            this.apiFacade.actualizarDatosAPI().subscribe(
              (data) => {
                this.ui.ocultarLoading(); //Oculta el loading
                this.ui.mostrarRespuestaExitosa(data, 'Operación exitosa');
                this.cargarJuegos(); //Recarga la lista de juegos
              },
              (error) => {
                this.ui.ocultarLoading(); //Oculta el loading en caso de error
                this.ui.mostrarRespuestaError(error, 'Operación errónea');
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  //Método que abre un modal para purgar datos y recarga la lista de juegos si es necesario
  public async purgarDatosAPI() {
    const modal = await this.modalController.create({
      component: PurgarDatosComponent,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5
    });

    modal.onDidDismiss().then((resultado) => {
      if (resultado.data?.refrescar) {
        this.cargarJuegos();
      }
    });

    return await modal.present();
  }

  //Método que ordena la lista de juegos según el tipo de orden especificado
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

  //Método que retorna el texto descriptivo del orden actual
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

  //Método que aplica un nuevo orden a la lista de juegos y actualiza la vista
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
