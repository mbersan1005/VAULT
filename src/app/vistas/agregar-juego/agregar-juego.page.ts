import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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

  //Formulario reactivo para capturar los datos del nuevo juego
  nuevoJuegoForm!: FormGroup;

  //Arrays que contienen los datos para las listas desplegables del formulario
  generos: { id: number, nombre: string }[] = [];
  plataformas: { id: number, nombre: string }[] = [];
  tiendas: { id: number, nombre: string }[] = [];
  desarrolladoras: { id: number, nombre: string }[] = [];
  publishers: { id: number, nombre: string }[] = [];

  //Archivo de imagen seleccionado por el usuario
  imagenArchivo: File | null = null;

  /*CONSTRUCTOR*/
  constructor(
    private ui: UiService, //Servicio para mostrar notificaciones y manejar la UI (toasts, loading, errores)
    private router: Router, //Servicio para la navegación entre páginas
    private apiFacade: ApiFacade, //Encapsula el acceso a la API backend
    private formBuilder: FormBuilder, //Constructor de formularios reactivos
    private cdr: ChangeDetectorRef //Permite la detección manual de cambios (útil para reiniciar el input de imagen)
  ) { }

  //Método que inicializa el componente configurando el formulario con validadores y cargando las listas desplegables
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

  //Método que recupera los datos para las listas desplegables (géneros, plataformas, tiendas, desarrolladoras, publishers)
  cargarDatos() {
    this.apiFacade.obtenerDatosFormulario().subscribe(
      (response) => {
        this.generos = response.generos || [];
        this.plataformas = response.plataformas || [];
        this.tiendas = response.tiendas || [];
        this.desarrolladoras = response.desarrolladoras || [];
        this.publishers = response.publishers || [];
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }

  //Método que valida y envía los datos del formulario junto con la imagen seleccionada al backend para crear un nuevo juego
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
          this.ui.mostrarRespuestaError(error, 'Operación errónea');
        }
      );
    } else {
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente y seleccione una imagen', 'dark');
    }
  }

  //Método que gestiona la selección del archivo de imagen, validando su tipo permitido (JPG, JPEG o PNG)
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, JPEG o PNG.');
      this.imagenArchivo = null;
      (event.target as HTMLInputElement).value = '';
      return;
    }

    this.imagenArchivo = file;
  }

  //Método que remueve la imagen seleccionada y reinicia el input de archivo, actualizando la vista
  eliminarImagen() {
    this.imagenArchivo = null;

    const inputFile = document.getElementById('input-imagen') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }

    this.cdr.detectChanges();
  }
}
