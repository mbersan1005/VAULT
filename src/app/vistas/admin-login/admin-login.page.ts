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

  constructor(
    private router: Router,
    private apiFacade: ApiFacade,
    private sesion: SesionService,
    private ui: UiService,
  ) {}

  submitForm() {
    if (this.bloqueoActivo) {
      this.ui.mostrarToast('Acceso bloqueado. Intenta más tarde.', 'dark');
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
          this.ui.mostrarToast('Inicio de sesión exitoso.', 'success');
          this.intentosFallidos = 0; 
          this.router.navigate(['/home']); 
        } else {
          this.registrarIntentoFallido();
        }

      },
      error: (error) => {
        console.error('Error en inicio de sesión:', error); 
        this.registrarIntentoFallido();
      }
    });
  }
  
  private registrarIntentoFallido() {
    this.intentosFallidos++;
    if (this.intentosFallidos >= 3) {
      this.bloqueoActivo = true;
      this.ui.mostrarToast('Acceso bloqueado. Inténtalo más tarde.', 'dark');
      
      setTimeout(() => {
        this.bloqueoActivo = false;
        this.intentosFallidos = 0;
      }, this.tiempoBloqueo);
    } else {
      this.ui.mostrarToast(`Intento fallido. Quedan ${3 - this.intentosFallidos} intentos.`, 'dark');
    }
  }

}
