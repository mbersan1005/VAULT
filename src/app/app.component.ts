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

  //Indica si el modo oscuro está activado
  paletteToggle = false;

  /*CONSTRUCTOR*/
  constructor(
    private menu: MenuController, //Controla el menú lateral
    private router: Router, //Servicio para la navegación entre páginas
    public sesion: SesionService, //Servicio que gestiona la sesión del usuario
    private alertController: AlertController, //Controla las alertas de confirmación
    private ui: UiService, //Servicio para notificaciones y mensajes al usuario
  ) {
    this.showSplash(); //Muestra la pantalla de splash al iniciar la aplicación
  }

  //Método que inicializa el componente y configura el modo oscuro según las preferencias del sistema
  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)'); //Detecta la preferencia de color del sistema
    this.initializeDarkPalette(prefersDark.matches); //Inicializa la paleta en función de la preferencia
    //Actualiza la configuración del modo oscuro cuando la preferencia del sistema cambia
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

  //Método que navega a la página especificada y cierra el menú lateral
  openPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.menu.close();
  }

  //Método que solicita confirmación para cerrar sesión y, de confirmarse, finaliza la sesión del usuario
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
            this.sesion.establecerSesion(false); //Cambia el estado de sesión a inactivo
            this.router.navigate(['/home']); //Redirige a la página principal
            this.ui.mostrarToast('Cierre de sesión exitoso.', 'success'); //Muestra una notificación de éxito
            this.menu.close(); //Cierra el menú lateral
          }
        }
      ]
    });

    await alert.present(); //Presenta la alerta de confirmación
  }

  //Método que configura la paleta de color según si se activa el modo oscuro
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  //Método que manejador del evento del toggle y actualiza la paleta de colores
  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  //Método que activa o desactiva el modo oscuro agregando la clase correspondiente al body
  toggleDarkPalette(shouldAdd: boolean) {
    const body = document.body;
    body.classList.remove('modo-claro', 'modo-oscuro'); //Elimina clases de modo de color previas

    if (shouldAdd) {
      body.classList.add('modo-oscuro'); //Activa el modo oscuro
    } else {
      body.classList.add('modo-claro');  //Activa el modo claro
    }
  }

  //Método que muestra la pantalla de splash durante 3000 ms al iniciar la aplicación
  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000
    });
  }
}
