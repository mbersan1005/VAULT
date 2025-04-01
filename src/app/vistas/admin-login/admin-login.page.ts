import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { SesionService } from 'src/app/services/sesion.service';


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
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
    private sesion: SesionService,
  ) {}

  submitForm() {
    if (this.bloqueoActivo) {
      this.mostrarToast('Acceso bloqueado. Intenta más tarde.', 'danger');
      return;
    }
  
    if (this.form.password !== this.form.confirmarPassword) {
      this.mostrarToast('Las contraseñas no coinciden.', 'warning');
      return;
    }
  
    this.apiFacade.inicioSesion(this.form.nombre, this.form.password).subscribe({
      next: (respuesta) => {

        if (respuesta?.mensaje === 'Inicio de sesión exitoso') { 
          this.sesion.establecerSesion(true);
          this.mostrarToast('Inicio de sesión exitoso.', 'success');
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
      this.mostrarToast('Acceso bloqueado. Inténtalo más tarde.', 'danger');
      
      setTimeout(() => {
        this.bloqueoActivo = false;
        this.intentosFallidos = 0;
      }, this.tiempoBloqueo);
    } else {
      this.mostrarToast(`Intento fallido. Quedan ${3 - this.intentosFallidos} intentos.`, 'warning');
    }
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

  logout(){
    this.sesion.establecerSesion(false);
    this.router.navigate(['/home']);
  }
}
