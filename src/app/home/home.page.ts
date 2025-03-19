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
  standalone: false,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  videojuegos: any[] = [];

  constructor(
    private menu: MenuController, 
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService) {}

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
          //this.message = 'No se encontraron artículos';
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        //this.message = 'Error al cargar los artículos';
      }
    );
  }

}
