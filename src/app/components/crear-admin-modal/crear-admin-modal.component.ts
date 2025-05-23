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

  //Formulario reactivo para capturar los datos del nuevo administrador
  adminForm!: FormGroup;
  
  /*CONSTRUCTOR*/
  constructor(
    private modalController: ModalController, //Controla el cierre del modal
    private formBuilder: FormBuilder, //Construye el formulario reactivo
    private ui: UiService, //Servicio para mostrar toasts/alertas
    private apiFacade: ApiFacade //Encapsula llamadas HTTP al backend
  ) {
    //Inicialización del formulario con validaciones
    this.adminForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repetirPassword: ['', [Validators.required]]
    });
  }

  //Método para cerrar el modal
  cerrarModal() {
    this.modalController.dismiss();
  }

  /*Método que se ejecuta al enviar el formulario*/
  crearCuentaAdmin() {
    if (this.adminForm.valid) {

      const { nombre, password, repetirPassword } = this.adminForm.value; 
      
      /*Se comprueba de que las contraseñas coincidan, de no ser así se
      informará al usuario */
      if (password.trim() !== repetirPassword.trim()) {  
        this.ui.mostrarToast('Las contraseñas no coinciden', 'dark');
        return;
      }
      
      //Datos que serán enviados al backend
      const adminData = {
        nombre: nombre.trim(),
        password: password.trim()
      };
      
      //Llamada al servicio encargado de crear el nuevo administrador
      this.apiFacade.crearAdministrador(adminData).subscribe(
        (response) => {
          console.log('Administrador creado con éxito:', response);
          this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa');
          this.modalController.dismiss(); //Se cierra el modal en caso de éxito
        },
        (error) => {
          console.error('Error al crear administrador:', error);
          this.ui.mostrarRespuestaError(error, 'Operación errónea');
        }
      );
    } else {
      //Si el formulario no es válido se informará al usuario
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente', 'dark');
    }
  }
  
}
