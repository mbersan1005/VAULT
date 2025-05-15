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

  plataformas: any[] = [];
  plataformasFiltradas: any[] = [];
  plataformasCargadas: number = 9; 
  plataformasPorCargar: number = 9;

  constructor(
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarPlataformas();
  }

  public cargarPlataformas() {
    this.apiFacade.recibirPlataformas().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);
          this.plataformas = data.plataformas;
          this.plataformasFiltradas = this.plataformas.slice(0, this.plataformasCargadas);
          console.log('Plataformas cargadas:', this.plataformasFiltradas);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  public verJuegosPlataforma(categoria: string, nombre: string){
    this.router.navigate(['/juegos-lista-filtro', categoria, nombre]);
  }

  public cargarMasPlataformas(event: any) {
    setTimeout(() => {
      this.plataformasCargadas += this.plataformasPorCargar;
      
      this.plataformasFiltradas = this.plataformas.slice(0, this.plataformasCargadas);
  
      event.target.complete();
  
      if (this.plataformasCargadas >= this.plataformas.length) {
        event.target.disabled = true;  
      }
    }, 500);
  }

}
