import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.page.html',
  styleUrls: ['./generos.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class GenerosPage {

  generos: any[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarGeneros();
  }

  public cargarGeneros() {
    this.apiFacade.recibirGeneros().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  // Verifica si 'data' contiene 'generos'
        if (data && data.generos && data.generos.length > 0) {
          this.generos = data.generos;
          console.log('Generos cargados:', this.generos); // Verifica el contenido de generos
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
  

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  public verJuegosGenero(generoId: number){
    this.router.navigate(['',generoId]);
  }

}
