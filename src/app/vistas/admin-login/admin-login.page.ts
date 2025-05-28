import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class AdminLoginPage {

  //Objeto que almacena los datos del formulario de login
  form: any = {
    nombre: '',
    password: '',
    confirmarPassword: ''
  };

  //Número de intentos fallidos de inicio de sesión
  intentosFallidos: number = 0;
  //Indica si el acceso está bloqueado tras varios intentos fallidos
  bloqueoActivo: boolean = false;
  //Tiempo de bloqueo en milisegundos (30 segundos)
  tiempoBloqueo: number = 30000;
  //Almacena la marca de tiempo del desbloqueo
  tiempoDesbloqueo: number = 0;

  /*CONSTRUCTOR*/
  constructor(
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
    private sesion: SesionService, //Gestiona la sesión del usuario
    private ui: UiService, //Servicio para mostrar notificaciones y mensajes al usuario
  ) { }

  //Método que envía el formulario de login, validando el bloqueo y la coincidencia de contraseñas
  submitForm() {
    //Verifica si el acceso está bloqueado y notifica al usuario si aún no ha transcurrido el tiempo de bloqueo
    if (this.bloqueoActivo) {
      const segundosRestantes = Math.ceil((this.tiempoDesbloqueo - Date.now()) / 1000);
      this.ui.mostrarToast(`Acceso bloqueado. Reinténtalo en ${segundosRestantes} segundos.`, 'dark');
      return;
    }

    //Verifica que la contraseña y la confirmación de contraseña coincidan
    if (this.form.password !== this.form.confirmarPassword) {
      this.ui.mostrarToast('Las contraseñas no coinciden.', 'dark');
      return;
    }

    //Realiza la petición de inicio de sesión a través de la API
    this.apiFacade.inicioSesion(this.form.nombre, this.form.password).subscribe({
      next: (respuesta) => {
        //Si el inicio de sesión es exitoso, establece la sesión, muestra un mensaje y navega a la página principal
        if (respuesta?.mensaje === 'Inicio de sesión exitoso') {
          this.sesion.establecerSesion(true);
          this.ui.mostrarRespuestaExitosa(respuesta, 'Operación exitosa');
          this.intentosFallidos = 0;
          this.router.navigate(['/home']);
        } else {
          //Si no se obtiene la respuesta esperada, registra el intento fallido
          this.registrarIntentoFallido();
        }
      },
      error: (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
        this.registrarIntentoFallido();
      }
    });
  }

  //Método que registra un intento fallido y, si se supera el límite, bloquea el acceso por un tiempo determinado
  private registrarIntentoFallido() {
    this.intentosFallidos++;
    if (this.intentosFallidos >= 3) {
      this.bloqueoActivo = true;
      this.tiempoDesbloqueo = Date.now() + this.tiempoBloqueo;

      this.ui.mostrarToast(`Acceso bloqueado. Reinténtalo en ${this.tiempoBloqueo / 1000} segundos.`, 'dark');

      //Reinicia el bloqueo una vez transcurrido el tiempo definido
      setTimeout(() => {
        this.bloqueoActivo = false;
        this.intentosFallidos = 0;
      }, this.tiempoBloqueo);
    } else {
      //Notifica la cantidad de intentos restantes
      this.ui.mostrarToast(`Intento fallido. Quedan ${3 - this.intentosFallidos} intentos.`, 'dark');
    }
  }
}
