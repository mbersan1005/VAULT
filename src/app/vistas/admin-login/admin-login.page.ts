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
  
  form: any = {
    nombre: '',
    password: '',
    confirmarPassword: ''
  };

  intentosFallidos: number = 0;
  bloqueoActivo: boolean = false;
  tiempoBloqueo: number = 30000; //30 segundos
  tiempoDesbloqueo: number = 0;

  constructor(
    private router: Router,
    private apiFacade: ApiFacade,
    private sesion: SesionService,
    private ui: UiService,
  ) {}

  submitForm() {
    if (this.bloqueoActivo) {
      const segundosRestantes = Math.ceil((this.tiempoDesbloqueo - Date.now()) / 1000);
      this.ui.mostrarToast(`Acceso bloqueado. Reinténtalo en ${segundosRestantes} segundos.`, 'dark');
      return;
    }
  
    if (this.form.password !== this.form.confirmarPassword) {
      this.ui.mostrarToast('Las contraseñas no coinciden.', 'dark');
      return;
    }
  
    this.apiFacade.inicioSesion(this.form.nombre, this.form.password).subscribe({
      next: (respuesta) => {
        if (respuesta?.mensaje === 'Inicio de sesión exitoso') {
          this.sesion.establecerSesion(true);
          this.ui.mostrarRespuestaExitosa(respuesta, 'Operación exitosa');
          this.intentosFallidos = 0;
          this.router.navigate(['/home']);
        } else {
          this.registrarIntentoFallido();
        }
      },
      error: (error) => {
        console.error('Error en inicio de sesión:', error);
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
        this.registrarIntentoFallido();
      }
    });
  }
  
  private registrarIntentoFallido() {
    this.intentosFallidos++;
    if (this.intentosFallidos >= 3) {
      this.bloqueoActivo = true;
      this.tiempoDesbloqueo = Date.now() + this.tiempoBloqueo;
  
      this.ui.mostrarToast(`Acceso bloqueado. Reinténtalo en ${this.tiempoBloqueo / 1000} segundos.`, 'dark');
  
      setTimeout(() => {
        this.bloqueoActivo = false;
        this.intentosFallidos = 0;
      }, this.tiempoBloqueo);
    } else {
      this.ui.mostrarToast(`Intento fallido. Quedan ${3 - this.intentosFallidos} intentos.`, 'dark');
    }
  }
  

}
