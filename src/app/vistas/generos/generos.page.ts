import { Component} from '@angular/core';
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

  generos: any[] = [];

  constructor(
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarGeneros();
  }

  public cargarGeneros() {
    this.apiFacade.recibirGeneros().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
        if (data && data.generos && data.generos.length > 0) {
          this.generos = data.generos;
          console.log('Generos cargados:', this.generos);
        } else {
          this.ui.mostrarToast('No se encontraron datos', 'dark');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarToast('Error al cargar los datos', 'dark');
      }
    );
  }
  
  public verJuegosGenero(categoria: string, nombre: string){
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

}
