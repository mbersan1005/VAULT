import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../facades/api.facade';
import { ApiRequestService } from '../requests/api.requests';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  videojuegos: any[] = [];

  constructor(
    private menu: MenuController, 
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController) {}

  ngOnInit(){
    this.cargarJuegos();
  }

  openPage(page: string) {
    if (page === 'home') {
      //this.router.navigate(['/home']);
    } else if (page === 'profile') {
      //this.router.navigate(['/profile']);
    }
    this.menu.close();
  }

  public cargarJuegos() {
    this.apiFacade.recibirJuegos().subscribe(
      (data) => {
        if (data && data.videojuegos && data.videojuegos.length > 0) {
          this.videojuegos = data.videojuegos;  
        } else {
          this.mostrarToast('No se encontraron datos','danger');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar los datos','danger')
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

}
