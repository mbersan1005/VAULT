import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.page.html',
  styleUrls: ['./generos.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class GenerosPage {

  //Lista que almacenará los géneros obtenidos de la API
  generos: any[] = [];

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para mostrar mensajes al usuario
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
  ) { }

  //Método que inicializa el componente y carga la lista de géneros
  ngOnInit() {
    this.cargarGeneros();
  }

  //Método que recupera la lista de géneros desde la API y asigna los datos a la variable 'generos'
  public cargarGeneros() {
    this.apiFacade.recibirGeneros().subscribe(
      (data) => {
        this.generos = data.generos; //Asigna la lista de géneros recibida
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }
  
  //Método que redirige a la lista de juegos filtrada por el género seleccionado
  public verJuegosGenero(categoria: string, nombre: string) {
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]); //Navega pasando los parámetros de categoría y nombre
  }

}
