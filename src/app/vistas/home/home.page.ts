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

  juegos: any[] = [];
  juegosFiltrados: any[] = [];
  juegosBuscados: any[] = [];  
  textoBusqueda: string = ''; 
  juegosCargados: number = 9; 
  juegosPorCargar: number = 9;
  ordenActual: string ='nombre_asc';
  isLoading: boolean = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;
  
  constructor(
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private ui: UiService,
    private datePipe: DatePipe,
    public sesion: SesionService,
    private alertController: AlertController,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(){
    this.cargarJuegos();
  }

  public cargarJuegos() {
    this.apiFacade.recibirJuegos().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);
        if (data && data.juegos && data.juegos.length > 0) {
          this.juegos = data.juegos; 
          const juegosOrdenados = this.ordenarJuegos(this.ordenActual, [...this.juegos]); 
          this.juegosFiltrados = juegosOrdenados.slice(0, this.juegosCargados);
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

  getPlataformas(plataformasJson: string): string {
    const plataformas = JSON.parse(plataformasJson); 
    return plataformas.map((plataforma: { nombre: any; }) => plataforma.nombre).join(', ');
  }

  getGeneros(generosJson: string): string {
    const generos = JSON.parse(generosJson);
    return generos.map((genero: { nombre: any; }) => genero.nombre).join(', ');
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
        this.ui.mostrarToast('Error en la búsqueda', 'dark');
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
  
  formatearFecha(fecha: string): string {
    return this.ui.formatearFecha(fecha);
  }

  public verJuego(juegoId: number){
    this.router.navigate(['/info-juego', juegoId]);
  }

  public agregarJuego(){
    this.router.navigate(['/agregar-juego']);
  }

  public editarJuego(juegoId: number){
    this.router.navigate(['/editar-juego', juegoId]);
  }

  public async crearAdministrador() {
    const modal = await this.modalController.create({
      component: CrearAdminModalComponent,
      breakpoints: [0.42, 0.53],
      initialBreakpoint: 0.42
    });
  
    return await modal.present();
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
  
                this.ui.mostrarToast('Juego eliminado correctamente', 'success');
              },
              (error) => {
                console.error('Error al eliminar el juego:', error);
                this.ui.mostrarToast('Error al eliminar el juego', 'dark');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  public async actualizarDatosAPI(){
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
            this.ui.mostrarLoading();

            this.apiFacade.actualizarDatosAPI().subscribe(
              (data) => {
                console.log('Datos actualizados', data);
                this.ui.ocultarLoading();
                this.ui.mostrarToast('Datos actualizados correctamente', 'success');
                
                this.cargarJuegos();
              },
              (error) => {
                console.error('Error al actualizar los datos:', error);
                this.ui.ocultarLoading();
                this.ui.mostrarToast('Error al actualizar los datos', 'dark');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  public async purgarDatosAPI() {
    const modal = await this.modalController.create({
      component: PurgarDatosComponent,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5
    });
    
    return await modal.present();
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
