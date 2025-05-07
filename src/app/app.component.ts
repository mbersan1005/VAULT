import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { SesionService } from './services/sesion/sesion.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { UiService } from './services/ui/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  paletteToggle = false;
  
  constructor(
    private menu: MenuController,
    private router: Router,
    public sesion: SesionService,
    private alertController: AlertController,
    private ui: UiService,
  ) {
    this.showSplash();
  }

  ngOnInit(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkPalette(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

  openPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.menu.close();
  }

   async logout() {

    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
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
            this.ui.mostrarToast('Cierre de sesión exitoso.', 'success');
            this.menu.close();
          }
        }
      ]
    });
  
    await alert.present();
    
  }

  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    const body = document.body;
    body.classList.remove('modo-claro', 'modo-oscuro');
  
    if (shouldAdd) {
      body.classList.add('modo-oscuro');
    } else {
      body.classList.add('modo-claro');
    }
  }
  
  async showSplash(){
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000
    });
  }

}
