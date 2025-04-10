import { Component } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
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
    private apiFacade: ApiFacade
  ) {}

  ngOnInit() {
    this.cargarJuegosAdmin();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  confirmarAccion() {
    this.apiFacade.purgarDatos().subscribe(
      (response) => {
        console.log('Datos purgados con éxito:', response);
        this.mostrarToast('Datos purgados correctamente', 'success');
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al purgar los datos:', error);
        this.mostrarToast('Error al purgar los datos', 'danger');
      }
    );
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
        this.mostrarToast('Error al cargar los juegos del admin', 'danger');
      }
    );
  }
}
