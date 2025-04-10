import { Component } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SesionService } from 'src/app/services/sesion.service';
import { CrearAdminModalComponent } from 'src/app/components/crear-admin-modal/crear-admin-modal.component';

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
    } else {
      this.juegosFiltrados = this.juegos.filter(juego =>
        juego.nombre?.toLowerCase().includes(this.textoBusqueda)
      ).slice(0, this.juegosCargados);
    }
  }

  public cargarMasJuegos(event: any) {
    setTimeout(() => {
      this.juegosCargados += this.juegosPorCargar;
  
      if (this.textoBusqueda.trim() === '') {
        this.juegosFiltrados = this.juegos.slice(0, this.juegosCargados);
      } else {
        this.juegosFiltrados = this.juegos.filter(juego =>
          juego.nombre?.toLowerCase().includes(this.textoBusqueda.toLowerCase())
        ).slice(0, this.juegosCargados);
      }
  
      event.target.complete();
  
      if (this.juegosCargados >= this.juegos.length) {
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
            this.apiFacade.actualizarDatosAPI().subscribe(
              (data) => {
                console.log('Datos actualizados', data);
                this.mostrarToast('Datos actualizados correctamente', 'success');
              },
              (error) => {
                console.error('Error al actualizar los datos:', error);
                this.mostrarToast('Error al actualizar los datos', 'danger');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }

}
