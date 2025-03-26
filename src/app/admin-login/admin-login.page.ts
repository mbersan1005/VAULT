import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

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

  submitForm() {
    console.log('Formulario enviado', this.form);
  }
}
