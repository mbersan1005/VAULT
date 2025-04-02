import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.page.html',
  styleUrls: ['./publishers.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class PublishersPage {

  publishers: any[] = [];
  publishersFiltrados: any[] = [];
  textoBusqueda: string = '';
  publishersCargados: number = 9;
  publishersPorCargar: number = 9;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
    this.cargarPublishers();
  }

  public cargarPublishers() {
    this.apiFacade.recibirPublishers().subscribe(
      (data) => {
        console.log('Datos recibidos desde la API:', data);  
        if (data && data.publishers && data.publishers.length > 0) {
          this.publishers = data.publishers;
          this.publishersFiltrados = this.publishers.slice(0, this.publishersCargados);
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
      this.publishersFiltrados = this.publishers.slice(0, this.publishersCargados); 
    } else {
      this.publishersFiltrados = this.publishers.filter(desarrolladoras =>
        desarrolladoras.nombre?.toLowerCase().includes(this.textoBusqueda)
      ).slice(0, this.publishersCargados);
    }
  }

  public cargarMasPublishers(event: any) {
    setTimeout(() => {
      this.publishersCargados += this.publishersPorCargar;
  
      if (this.textoBusqueda.trim() === '') {
        this.publishersFiltrados = this.publishers.slice(0, this.publishersCargados);
      } else {
        this.publishersFiltrados = this.publishers.filter(desarrolladoras =>
          desarrolladoras.nombre?.toLowerCase().includes(this.textoBusqueda.toLowerCase())
        ).slice(0, this.publishersCargados);
      }
  
      event.target.complete();
  
      if (this.publishersCargados >= this.publishers.length) {
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

  public verJuegosPublisher(publisherId: number){
    this.router.navigate(['',publisherId]);
  }
  
}
