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
  
  // Lista de juegos administrados (insertados o modificados)
  juegos: any[] = [];

  /*CONSTRUCTOR*/
  constructor(
    private modalController: ModalController, //Para cerrar el modal
    private ui: UiService, //Servicio para toasts y alertas
    private apiFacade: ApiFacade, //Acceso al backend
    private alertController: AlertController, //Para mostrar alertas de confirmación
  
  ) {}

  //Método que se ejecuta al cargar el componente
  ngOnInit() {
    this.cargarJuegosAdmin();
  }

  //Método para cerrar el modal, opcionalmente refrescando datos
  cerrarModal(refrescar: boolean = false) {
    this.modalController.dismiss({ refrescar });
  }
  
  //Método que muestra un cuadro de diálogo para confirmar la acción de purgado
  async confirmarAccion() {
    const alert = await this.alertController.create({
      header: 'Confirmar reseteo de datos',
      message: '¿Estás seguro de que quieres resetear los datos?\nPuede conllevar unos minutos',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No', //Cancela la acción
          role: 'cancel'
        },
        {
          text: 'Sí', //Ejecuta la acción
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

  //Método que carga los juegos que han sido modificados o insertados por administradores
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
