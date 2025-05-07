import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private datePipe: DatePipe,

    ) { }

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
  
  async cerrarModal() {
    await this.modalController.dismiss();
  }

  extraerIdNombre(idsSeleccionados: any[], fuente: { id: number, nombre: string }[]): { id: number, nombre: string }[] {
    return fuente.filter(item => idsSeleccionados.includes(item.id) || idsSeleccionados.includes(String(item.id))).map(item => ({
      id: item.id,
      nombre: item.nombre
    }));
  }
  
  formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha; 
  }

  parseJsonData(data: any): any[] {
    if (!data) return []; 
    try {
      return typeof data === 'string' ? JSON.parse(data) : data; 
    } catch (error) {
      console.error('Error al parsear JSON:', error, data);
      return []; 
    }
  }

}
