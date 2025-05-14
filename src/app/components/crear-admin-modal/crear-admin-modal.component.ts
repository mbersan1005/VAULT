import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { UiService } from 'src/app/services/ui/ui.service';

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
    private ui: UiService,
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

  crearCuentaAdmin() {
    if (this.adminForm.valid) {

      const { nombre, password, repetirPassword } = this.adminForm.value; 
      
      if (password.trim() !== repetirPassword.trim()) {  
        this.ui.mostrarToast('Las contraseñas no coinciden', 'dark');
        return;
      }
    
      const adminData = {
        nombre: nombre.trim(),
        password: password.trim()
      };
    
      this.apiFacade.crearAdministrador(adminData).subscribe(
        (response) => {
          console.log('Administrador creado con éxito:', response);
          this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa');
          this.modalController.dismiss();
        },
        (error) => {
          console.error('Error al crear administrador:', error);
          this.ui.mostrarRespuestaError(error, 'Operación errónea');
        }
      );
    } else {
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente', 'dark');
    }
  }
  
}
