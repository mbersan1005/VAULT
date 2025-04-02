import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desarrolladoras',
  templateUrl: './desarrolladoras.page.html',
  styleUrls: ['./desarrolladoras.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class DesarrolladorasPage {

  desarrolladoras: any[] = [];
  desarrolladorasFiltradas: any[] = [];
  textoBusqueda: string = '';
  desarrolladorasCargadas: number = 9;
  desarrolladorasPorCargar: number = 9;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarDesarrolladoras();
  }

  public cargarDesarrolladoras() {
    this.apiFacade.recibirDesarrolladoras().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
        if (data && data.desarrolladoras && data.desarrolladoras.length > 0) {
          this.desarrolladoras = data.desarrolladoras;
          this.desarrolladorasFiltradas = this.desarrolladoras.slice(0, this.desarrolladorasCargadas);
        } else {
          this.mostrarToast('No se encontraron datos', 'danger');
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar los datos', 'danger');
      }
    );
  }

  public realizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value?.toLowerCase() || ''; 
    if (this.textoBusqueda.trim() === '') {
      this.desarrolladorasFiltradas = this.desarrolladoras.slice(0, this.desarrolladorasCargadas); 
    } else {
      this.desarrolladorasFiltradas = this.desarrolladoras.filter(desarrolladoras =>
        desarrolladoras.nombre?.toLowerCase().includes(this.textoBusqueda)
      ).slice(0, this.desarrolladorasCargadas);
    }
  }

  public cargarMasDesarrolladoras(event: any) {
    setTimeout(() => {
      this.desarrolladorasCargadas += this.desarrolladorasPorCargar;
  
      if (this.textoBusqueda.trim() === '') {
        this.desarrolladorasFiltradas = this.desarrolladoras.slice(0, this.desarrolladorasCargadas);
      } else {
        this.desarrolladorasFiltradas = this.desarrolladoras.filter(desarrolladoras =>
          desarrolladoras.nombre?.toLowerCase().includes(this.textoBusqueda.toLowerCase())
        ).slice(0, this.desarrolladorasCargadas);
      }
  
      event.target.complete();
  
      if (this.desarrolladorasCargadas >= this.desarrolladoras.length) {
        event.target.disabled = true;
      }
    }, 500);
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

  public verJuegosDesarrolladoras(desarrolladoraId: number){
    this.router.navigate(['',desarrolladoraId]);
  }

}
