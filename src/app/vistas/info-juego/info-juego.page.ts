import { Component } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';  
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-info-juego',
  templateUrl: 'info-juego.page.html',
  styleUrls: ['info-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  providers: [DatePipe]
})
export class InfoJuegoPage {

  juegoId: number | null = null;
  juego: any = {};
  iframeSrc: SafeResourceUrl | null = null;

  constructor(
    private menu: MenuController,
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.juegoId = idParam ? parseInt(idParam, 10) : null;

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId);
    } else {
      this.mostrarToast('ID del juego no válido', 'danger');
    }
  }

  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        this.juego = data.juego || data;
  
        this.juego.tiendas = this.parseJsonData(this.juego.tiendas);
        this.juego.plataformas_principales = this.parseJsonData(this.juego.plataformas_principales);
        this.juego.generos = this.parseJsonData(this.juego.generos);
        this.juego.desarrolladoras = this.parseJsonData(this.juego.desarrolladoras);
        this.juego.publishers = this.parseJsonData(this.juego.publishers);
  
        this.juego.publishers = this.juego.publishers || [];
        this.juego.desarrolladoras = this.juego.desarrolladoras || [];
        this.juego.generos = this.juego.generos || [];
        this.juego.plataformas_principales = this.juego.plataformas_principales || [];
        this.juego.tiendas = this.juego.tiendas || [];
  
        if (this.juego.nombre) {
          this.apiFacade.obtenerAppId(this.juego.nombre).subscribe(
            (res) => {
              if (res?.appid) {
                this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://steamdb.info/embed/?appid=${res.appid}`
                );
              } else {
                this.iframeSrc = null;
              }
            },
            (err) => {
              console.error('Error al obtener AppID:', err);
              this.iframeSrc = null;
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.mostrarToast('Error al cargar los datos del juego', 'danger');
      }
    );
  }
  
  private parseJsonData(data: any): any[] {
    if (!data) return []; 
    try {
      return typeof data === 'string' ? JSON.parse(data) : data; 
    } catch (error) {
      console.error('Error al parsear JSON:', error, data);
      return []; 
    }
  }

  getSitioWeb(sitio: string | null): string {
    if (sitio) {
      return `<a href="${sitio}" target="_blank">${sitio}</a>`;
    } else {
      return 'No establecido';
    }
  }

  public formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha; 
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
  
  isLastItem(array: any[], item: any): boolean {
    return array[array.length - 1] === item;
  }
  
}
