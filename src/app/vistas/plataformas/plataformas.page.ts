import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private toastController: ToastController,
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
        if (data && data.plataformas && data.plataformas.length > 0) {
          this.plataformas = data.plataformas;
          this.plataformasFiltradas = this.plataformas.slice(0, this.plataformasCargadas);
          console.log('Plataformas cargadas:', this.plataformasFiltradas);
        } else {
          this.mostrarToast('No se encontraron plataformas', 'danger');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar las plataformas', 'danger');
      }
    );
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

  public verJuegosPlataforma(plataformaId: number){
    this.router.navigate(['', plataformaId]);
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
