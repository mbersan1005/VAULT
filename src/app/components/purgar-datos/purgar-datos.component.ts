import { Component } from '@angular/core';
import { AlertController, IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-purgar-datos',
  templateUrl: './purgar-datos.component.html',
  styleUrls: ['./purgar-datos.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class PurgarDatosComponent {
  
  juegos: any[] = [];

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private apiFacade: ApiFacade,
    private loadingController: LoadingController,
    private alertController: AlertController,
  
  ) {}

  ngOnInit() {
    this.cargarJuegosAdmin();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async confirmarAccion() {
    
    const alert = await this.alertController.create({
      header: 'Confirmar reseteo de datos',
      message: '¿Estás seguro de que quieres resetear los datos?\nPuede conllevar unos minutos',
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
            this.apiFacade.purgarDatos().subscribe(
              (response) => {
                console.log('Datos reseteados con éxito:', response);
                this.ocultarLoading();
                this.mostrarToast('Datos reseteados correctamente', 'success');
                this.cerrarModal();
              },
              (error) => {
                console.error('Error al resetear los datos:', error);
                this.ocultarLoading();
                this.mostrarToast('Error al resetear los datos', 'dark');
              }
            );
          }
        }
      ]
    });
  
    await alert.present();

  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  public cargarJuegosAdmin() {
    this.apiFacade.recibirJuegosAdmin().subscribe(
      (data) => {
        console.log('Juegos de admins recibidos desde la API:', data);
        if (data && data.juegos && data.juegos.length > 0) {
          this.juegos = data.juegos;  
        }
      },
      (error) => {
        console.error('Error al obtener juegos de admins', error);
        this.mostrarToast('Error al cargar los juegos del admin', 'dark');
      }
    );
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
}
