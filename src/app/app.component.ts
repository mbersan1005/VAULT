import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { SesionService } from './services/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private router: Router,
    public sesion: SesionService,
    private alertController: AlertController,
    private toastController: ToastController,
  
  ) {}

  openPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.menu.close();
  }

   async logout() {

    const alert = await this.alertController.create({
      header: 'Confirmar Logout',
      message: '¿Estás seguro de que quieres cerrar sesión',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.sesion.establecerSesion(false);
            this.router.navigate(['/home']);
            this.mostrarToast('Cierre de sesión exitoso.', 'success');
            this.menu.close();
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
      color: color
    });
    await toast.present();
  }

}
