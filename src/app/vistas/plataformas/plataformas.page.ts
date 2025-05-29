import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-plataformas',
  templateUrl: './plataformas.page.html',
  styleUrls: ['./plataformas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PlataformasPage {

  //Array que almacena todas las plataformas recibidas desde la API
  plataformas: any[] = [];

  //Array que contiene las plataformas que se mostrarán de forma paginada
  plataformasFiltradas: any[] = [];

  //Número de plataformas cargadas inicialmente en la vista
  plataformasCargadas: number = 9;

  //Número de plataformas que se agregarán en cada carga adicional
  plataformasPorCargar: number = 9;

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para notificaciones y mensajes al usuario
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula las llamadas a la API
  ) { }

  //Método que se ejecuta al iniciar el componente y carga las plataformas
  ngOnInit() {
    this.cargarPlataformas();
  }

  //Método que recupera las plataformas desde la API y actualiza la lista visible
  public cargarPlataformas() {
    this.apiFacade.recibirPlataformas().subscribe(
      (data) => {
        this.plataformas = data.plataformas; //Asigna las plataformas recibidas
        //Muestra únicamente las plataformas iniciales según la paginación definida
        this.plataformasFiltradas = this.plataformas.slice(0, this.plataformasCargadas);
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }

  //Método que navega a la lista de juegos filtrada por la plataforma seleccionada
  public verJuegosPlataforma(categoria: string, nombre: string) {
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  //Método que incrementa la cantidad de plataformas mostradas al activar el scroll infinito
  public cargarMasPlataformas(event: any) {
    setTimeout(() => {
      //Incrementa el contador de plataformas cargadas
      this.plataformasCargadas += this.plataformasPorCargar;

      //Actualiza la lista de plataformas visibles según el nuevo contador
      this.plataformasFiltradas = this.plataformas.slice(0, this.plataformasCargadas);

      event.target.complete(); //Indica que la carga adicional ha finalizado

      //Si se han cargado todas las plataformas, deshabilita el scroll infinito
      if (this.plataformasCargadas >= this.plataformas.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
