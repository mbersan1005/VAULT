import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { UiService } from 'src/app/services/ui/ui.service';

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
    private ui: UiService,
    private router: Router,
    private apiFacade: ApiFacade,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.nuevoJuegoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      nota_metacritic: [''], 
      fecha_lanzamiento: ['', Validators.required],
      sitio_web: [''], 
      tiendas: [[], Validators.required],
      plataformas: [[], Validators.required],
      generos: [[], Validators.required],
      desarrolladoras: [[], Validators.required],
      publishers: [[], Validators.required],
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.apiFacade.obtenerDatosFormulario().subscribe((response) => {
      this.generos = response.generos || [];
      this.plataformas = response.plataformas || [];
      this.tiendas = response.tiendas || [];
      this.desarrolladoras = response.desarrolladoras || [];
      this.publishers = response.publishers || [];
    },(error) => {
      console.error('Error al agregar el juego:', error);
      this.ui.mostrarRespuestaError(error, 'Operación errónea');    
    }
  );
  }

  guardarJuego() {
    if (this.nuevoJuegoForm.valid && this.imagenArchivo) {
  
      const juegoData = {
        ...this.nuevoJuegoForm.value,
        plataformas: this.ui.extraerIdNombre(this.nuevoJuegoForm.value.plataformas, this.plataformas),
        generos: this.ui.extraerIdNombre(this.nuevoJuegoForm.value.generos, this.generos),
        tiendas: this.ui.extraerIdNombre(this.nuevoJuegoForm.value.tiendas, this.tiendas),
        desarrolladoras: this.ui.extraerIdNombre(this.nuevoJuegoForm.value.desarrolladoras, this.desarrolladoras),
        publishers: this.ui.extraerIdNombre(this.nuevoJuegoForm.value.publishers, this.publishers),
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
          this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa');
          this.router.navigateByUrl('/home').then(() => window.location.reload());
        },
        (error) => {
          console.error('Error al agregar el juego:', error);
          this.ui.mostrarRespuestaError(error, 'Operación errónea');        
        }
      );
    } else {
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente y seleccione una imagen', 'dark');
    }
  }
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenArchivo = file;
    }
  }

}
