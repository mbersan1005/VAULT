import { Component } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiService } from 'src/app/services/ui/ui.service';

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
    private ui: UiService,
    private apiFacade: ApiFacade,
    private alertController: AlertController,
  
  ) {}

  ngOnInit() {
    this.cargarJuegosAdmin();
  }

  cerrarModal(refrescar: boolean = false) {
    this.modalController.dismiss({ refrescar });
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
            this.ui.mostrarLoading();
            this.apiFacade.purgarDatos().subscribe(
              (response) => {
                console.log('Datos reseteados con éxito:', response);
                this.ui.ocultarLoading();
                this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa');
                this.cerrarModal(true);
              },
              (error) => {
                console.error('Error al resetear los datos:', error);
                this.ui.ocultarLoading();
                this.ui.mostrarRespuestaError(error, 'Operación errónea');              }
            );
          }
        }
      ]
    });
    await alert.present();
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
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

}
