import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  /*CONSTRUCTOR*/
  constructor(
    private toastController: ToastController, // Servicio para mostrar toasts
    private loadingController: LoadingController, // Servicio para mostrar loading
    private datePipe: DatePipe, // Servicio para formatear fechas
  ) { }

  //Método que muestra un toast con el mensaje, color y duración especificados
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  //Método que presenta un spinner de carga con un mensaje informativo
  async mostrarLoading(mensaje: string = 'Actualizando datos, por favor espere...') {
    const loading = await this.loadingController.create({
      message: mensaje,
      spinner: 'crescent',
      duration: 0,
    });
    await loading.present();
  }

  //Método que oculta el spinner de carga
  async ocultarLoading() {
    await this.loadingController.dismiss();
  }

  /*Método que extrae y retorna un array de objetos {id, nombre} a partir de los IDs seleccionados
  y la fuente de datos proporcionada*/
  extraerIdNombre(idsSeleccionados: any[], fuente: { id: number, nombre: string }[]): { id: number, nombre: string }[] {
    return fuente
      .filter(item => idsSeleccionados.includes(item.id) || idsSeleccionados.includes(String(item.id)))
      .map(item => ({
        id: item.id,
        nombre: item.nombre
      }));
  }

  //Método que formatea una fecha usando el formato 'dd-MM-yyyy'
  formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha;
  }

  /* Método que parsea un string JSON y retorna el objeto correspondiente;
  si el dato ya es un objeto, lo retorna directamente. En caso de error, retorna un array vacío*/
  parseJsonData(data: any): any[] {
    if (!data) return [];
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      return [];
    }
  }

  //Método que muestra un toast con un mensaje de éxito obtenido de la respuesta
  mostrarRespuestaExitosa(data: any, fallback: string = 'Operación exitosa') {
    const mensaje = data?.mensaje || fallback;
    this.mostrarToast(mensaje, 'success');
  }

  /*Método que extrae el mensaje de error de la respuesta y muestra un toast de error;
  si no se encuentra un mensaje, utiliza uno predeterminado*/
  mostrarRespuestaError(error: any, fallback: string = 'Ocurrió un error') {
    let mensaje = fallback;

    if (error?.error) {
      if (typeof error.error === 'object') {
        mensaje = error.error.error || error.error.mensaje || fallback;
      } else if (typeof error.error === 'string') {
        mensaje = error.error;
      }
    }

    this.mostrarToast(mensaje, 'dark');
  }
}
