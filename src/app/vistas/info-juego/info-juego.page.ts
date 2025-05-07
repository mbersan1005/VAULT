import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';
import { ApiRequestService } from '../../requests/api.requests';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';  
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UiService } from 'src/app/services/ui/ui.service';

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
    private apiFacade: ApiFacade,
    public apiRequestService: ApiRequestService,
    private ui: UiService,
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
      this.ui.mostrarToast('ID del juego no válido', 'dark');
    }
  }

  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        this.juego = data.juego || data;
  
        this.juego.tiendas = this.ui.parseJsonData(this.juego.tiendas);
        this.juego.plataformas_principales = this.ui.parseJsonData(this.juego.plataformas_principales);
        this.juego.generos = this.ui.parseJsonData(this.juego.generos);
        this.juego.desarrolladoras = this.ui.parseJsonData(this.juego.desarrolladoras);
        this.juego.publishers = this.ui.parseJsonData(this.juego.publishers);
  
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
              this.ui.mostrarToast('No se ha podido cargar los datos de la gráfica', 'dark');
              this.iframeSrc = null;
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarToast('Error al cargar los datos del juego', 'dark');
      }
    );
  }
  
  getSitioWeb(sitio: string | null): string {
    if (sitio) {
      return `<a href="${sitio}" target="_blank">${sitio}</a>`;
    } else {
      return 'No establecido';
    }
  }

  formatearFecha(fecha: string): string {
    return this.ui.formatearFecha(fecha);
  }

  isLastItem(array: any[], item: any): boolean {
    return array[array.length - 1] === item;
  }
  
}
