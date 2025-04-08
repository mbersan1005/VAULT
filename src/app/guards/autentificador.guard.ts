import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

export const autentificadorGuard: CanActivateFn = async (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);
  const toastController = inject(ToastController);

  if (sesionService.comprobarSesion()) {
    return true;
  } else {
    const toast = await toastController.create({
      message: 'Debes iniciar sesión como administrador para acceder',
      duration: 2000,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
    router.navigate(['/home']);
    return false;
  }
};
