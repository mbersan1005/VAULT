import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.page.html',
  styleUrls: ['./tiendas.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class TiendasPage {

  tiendas: any[] = [];

  constructor(
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarTiendas();
  }

  public cargarTiendas() {
    this.apiFacade.recibirTiendas().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
        if (data && data.tiendas && data.tiendas.length > 0) {
          this.tiendas = data.tiendas;
          console.log('Tiendas cargadas:', this.tiendas);
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

  public verJuegosTienda(categoria: string, nombre: string){
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  getUrlCompleta(dominio: string): string {

    if (dominio && !dominio.startsWith('http')) {
      return 'https://' + dominio;
    }
    return dominio;
  }  

}
