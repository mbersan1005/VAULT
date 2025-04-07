import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { SesionService } from 'src/app/services/sesion.service';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-juego',
  templateUrl: './agregar-juego.page.html',
  styleUrls: ['./agregar-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],  
})
export class AgregarJuegoPage{

  nuevoJuegoForm!: FormGroup;
  fechaLanzamiento: string = '';
  generos: { id: number, nombre: string }[] = [];
  plataformas: { id: number, nombre: string }[] = [];
  tiendas: { id: number, nombre: string }[] = [];
  desarrolladoras: { id: number, nombre: string }[] = [];
  publishers: { id: number, nombre: string }[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
    private formBuilder: FormBuilder,
    private sesionService: SesionService
  ) { }

  ngOnInit() {

    this.nuevoJuegoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      nota_metacritic: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      fecha_lanzamiento: ['', Validators.required],
      imagen: ['', [Validators.required, Validators.pattern('https?://.+')]],
      tiendas: [[]],
      plataformas: [[]],
      generos: [[]],
      desarrolladoras: [[]],
      publishers: [[]],
    });

    this.cargarDatos();

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

  cargarDatos() {
    this.apiFacade.obtenerDatosFormulario().subscribe((response) => {
      console.log(response);
      this.generos = response.generos || [];
      this.plataformas = response.plataformas || [];
      this.tiendas = response.tiendas || [];
      this.desarrolladoras = response.desarrolladoras || [];
      this.publishers = response.publishers || [];
    });
  }

  onFechaChange(event: any) {
    this.fechaLanzamiento = event.detail.value;
  }

  guardarJuego() {
    if (this.nuevoJuegoForm.valid) {

      let fechaSeleccionada = this.nuevoJuegoForm.value.fecha_lanzamiento;
      const fechaConvertida = this.adaptarFormatoFecha(fechaSeleccionada);
      
      this.nuevoJuegoForm.patchValue({
        fecha_lanzamiento: fechaConvertida
      });

      const juegoData = this.nuevoJuegoForm.value;

      this.apiFacade.agregarJuego(juegoData).subscribe(
        (response) => {
          console.log('Juego agregado con éxito:', response);
          this.mostrarToast('Juego agregado correctamente', 'success');
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error al agregar el juego:', error);
          this.mostrarToast('Error al agregar el juego', 'danger');
        }
      );
    } else {
      this.mostrarToast('Por favor, complete todos los campos correctamente', 'danger');
    }
  }

  adaptarFormatoFecha(fecha: string): string {
    const partes = fecha.split('-');
    if (partes.length === 3) {
      const dia = partes[0];
      const mes = partes[1];
      const anio = partes[2];
      return `${anio}-${mes}-${dia}`;
    }
    return fecha;
  }

}
