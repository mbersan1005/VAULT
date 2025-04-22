import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SesionService } from 'src/app/services/sesion.service';
import { CrearAdminModalComponent } from 'src/app/components/crear-admin-modal/crear-admin-modal.component';
import { PurgarDatosComponent } from 'src/app/components/purgar-datos/purgar-datos.component';

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
  textoBusqueda: string = ''; 
  juegosCargados: number = 9; 
  juegosPorCargar: number = 9;
  ordenActual: string ='nombre_asc';

  isLoading = false;
  
  constructor(
    private menu: MenuController, 
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
    private datePipe: DatePipe,
    public sesion: SesionService,
    private alertController: AlertController,
    private loadingController: LoadingController,
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
          this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
          this.ordenarJuegos(this.ordenActual);
          this.changeDetector.detectChanges();
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
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; 
    
    if (this.textoBusqueda.trim() === '') {
      this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
      return;
    }
  
    this.apiFacade.realizarBusqueda(this.textoBusqueda).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);
        this.juegosFiltrados = response.juegos || [];
        this.ordenarJuegos(this.ordenActual); 
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
      breakpoints: [0.32, 0.53],
      initialBreakpoint: 0.32
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
  
  public async actualizarDatosAPI(){
    const alert = await this.alertController.create({
      header: 'Confirmar actualización de Datos',
      message: '¿Estás seguro de que quieres actualizar los datos?\nPuede conllevar unos minutos',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.mostrarLoading();

            this.apiFacade.actualizarDatosAPI().subscribe(
              (data) => {
                console.log('Datos actualizados', data);
                this.ocultarLoading();
                this.mostrarToast('Datos actualizados correctamente', 'success');
                
                this.cargarJuegos();
              },
              (error) => {
                console.error('Error al actualizar los datos:', error);
                this.ocultarLoading();
                this.mostrarToast('Error al actualizar los datos', 'danger');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }

  async mostrarLoading() {
    const loading = await this.loadingController.create({
      message: 'Actualizando datos, por favor espere...',
      spinner: 'crescent',
      duration: 0,
    });
  
    await loading.present();
  }
  
  async ocultarLoading() {
    await this.loadingController.dismiss();
  }

  public async purgarDatosAPI() {
    const modal = await this.modalController.create({
      component: PurgarDatosComponent,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5
    });
    
    return await modal.present();
  }

  public ordenarJuegos(tipoOrden: string) {
    this.ordenActual = tipoOrden;
  
    switch (tipoOrden) {
      case 'nombre_asc':
        this.juegos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre_desc':
        this.juegos.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'fecha_asc':
        this.juegos.sort((a, b) =>
          new Date(a.fecha_lanzamiento).getTime() - new Date(b.fecha_lanzamiento).getTime()
        );
        break;
      case 'fecha_desc':
        this.juegos.sort((a, b) =>
          new Date(b.fecha_lanzamiento).getTime() - new Date(a.fecha_lanzamiento).getTime()
        );
        break;
      case 'nota_asc':
        this.juegos.sort((a, b) => a.nota_metacritic - b.nota_metacritic);
        break;
      case 'nota_desc':
        this.juegos.sort((a, b) => b.nota_metacritic - a.nota_metacritic);
        break;
    }
  
    this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
    this.changeDetector.detectChanges();
  }
  


}
