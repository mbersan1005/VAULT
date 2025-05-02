import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { SesionService } from 'src/app/services/sesion.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-juego',
  templateUrl: './agregar-juego.page.html',
  styleUrls: ['./agregar-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],  
})
export class AgregarJuegoPage {

  nuevoJuegoForm!: FormGroup;
  generos: { id: number, nombre: string }[] = [];
  plataformas: { id: number, nombre: string }[] = [];
  tiendas: { id: number, nombre: string }[] = [];
  desarrolladoras: { id: number, nombre: string }[] = [];
  publishers: { id: number, nombre: string }[] = [];
  imagenArchivo: File | null = null;


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
      nota_metacritic: [''], 
      fecha_lanzamiento: ['', Validators.required],
      sitio_web: [''], 
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
      this.generos = response.generos || [];
      this.plataformas = response.plataformas || [];
      this.tiendas = response.tiendas || [];
      this.desarrolladoras = response.desarrolladoras || [];
      this.publishers = response.publishers || [];
    });
  }

  guardarJuego() {
    if (this.nuevoJuegoForm.valid && this.imagenArchivo) {
  
      const juegoData = {
        ...this.nuevoJuegoForm.value,
        plataformas: this.extraerIdNombre(this.nuevoJuegoForm.value.plataformas, this.plataformas),
        generos: this.extraerIdNombre(this.nuevoJuegoForm.value.generos, this.generos),
        tiendas: this.extraerIdNombre(this.nuevoJuegoForm.value.tiendas, this.tiendas),
        desarrolladoras: this.extraerIdNombre(this.nuevoJuegoForm.value.desarrolladoras, this.desarrolladoras),
        publishers: this.extraerIdNombre(this.nuevoJuegoForm.value.publishers, this.publishers),
        creado_por_admin: 1,
        nota_metacritic: this.nuevoJuegoForm.value.nota_metacritic || null,
        sitio_web: this.nuevoJuegoForm.value.sitio_web || null
      };
  
      const formData = new FormData();
  
      for (const key in juegoData) {
        if (Array.isArray(juegoData[key])) {
          formData.append(key, JSON.stringify(juegoData[key]));
        } else if (juegoData[key] !== null && juegoData[key] !== undefined) {
          formData.append(key, juegoData[key]);
        }
      }
  
      formData.append('imagen', this.imagenArchivo);
  
      this.apiFacade.agregarJuego(formData).subscribe(
        (response) => {
          this.mostrarToast('Juego agregado correctamente', 'success');
          this.router.navigateByUrl('/home').then(() => window.location.reload());
        },
        (error) => {
          console.error('Error al agregar el juego:', error);
          this.mostrarToast('Error al agregar el juego', 'danger');
        }
      );
    } else {
      this.mostrarToast('Por favor, complete todos los campos correctamente y seleccione una imagen', 'danger');
    }
  }
  

  private extraerIdNombre(idsSeleccionados: any[], fuente: { id: number, nombre: string }[]): { id: number, nombre: string }[] {
    return fuente.filter(item => idsSeleccionados.includes(item.id) || idsSeleccionados.includes(String(item.id))).map(item => ({
      id: item.id,
      nombre: item.nombre
    }));
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenArchivo = file;
    }
  }

}
