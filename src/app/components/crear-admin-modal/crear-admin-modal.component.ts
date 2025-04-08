import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';

@Component({
  selector: 'app-crear-admin-modal',
  templateUrl: './crear-admin-modal.component.html',
  styleUrls: ['./crear-admin-modal.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CrearAdminModalComponent {

  adminForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private apiFacade: ApiFacade
  ) {
    this.adminForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repetirPassword: ['', [Validators.required]]
    });
  }

  cerrarModal() {
    this.modalController.dismiss();
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

  crearCuentaAdmin() {
    if (this.adminForm.valid) {

      const { nombre, password, repetirPassword } = this.adminForm.value; 
      
      if (password.trim() !== repetirPassword.trim()) {  
        this.mostrarToast('Las contraseñas no coinciden', 'danger');
        return;
      }
    
      const adminData = {
        nombre: nombre.trim(),
        password: password.trim()
      };
    
      this.apiFacade.crearAdministrador(adminData).subscribe(
        (response) => {
          console.log('Administrador creado con éxito:', response);
          this.mostrarToast('Administrador creado correctamente', 'success');
          this.modalController.dismiss();
        },
        (error) => {
          console.error('Error al crear administrador:', error);
          this.mostrarToast('Error al crear el administrador', 'danger');
        }
      );
    } else {
      this.mostrarToast('Por favor, complete todos los campos correctamente', 'danger');
    }
  }
  
  
  
}
