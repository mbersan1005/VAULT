import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { ApiRequestService } from 'src/app/requests/api.requests';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-editar-juego',
  templateUrl: './editar-juego.page.html',
  styleUrls: ['./editar-juego.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class EditarJuegoPage {

  //ID del juego obtenido de la URL
  juegoId: number | null = null;

  //Objeto que almacenará los datos del juego
  juego: any = {};

  //Formulario reactivo para editar la información del juego
  editarJuegoForm!: FormGroup;

  //Lista de géneros disponibles
  generos: { id: number, nombre: string }[] = [];

  //Lista de plataformas disponibles
  plataformas: { id: number, nombre: string }[] = [];

  //Lista de tiendas disponibles
  tiendas: { id: number, nombre: string }[] = [];

  //Lista de desarrolladoras disponibles
  desarrolladoras: { id: number, nombre: string }[] = [];

  //Lista de publishers disponibles
  publishers: { id: number, nombre: string }[] = [];

  //Archivo de imagen seleccionado
  imagenArchivo: File | null = null;

  //Valores originales del formulario para detectar cambios
  private valoresOriginales: any = {};


  /*CONSTRUCTOR*/
  constructor(
    private router: Router, //Servicio para la navegación
    private apiFacade: ApiFacade, //Facade para llamadas a la API
    public apiRequestService: ApiRequestService, //Servicio para peticiones HTTP
    private ui: UiService, //Servicio para mostrar mensajes al usuario
    private datePipe: DatePipe, //Servicio para formatear fechas
    private route: ActivatedRoute, //Permite acceder a los parámetros de la ruta
    private formBuilder: FormBuilder, //Facilita la creación del formulario reactivo
    private cdr: ChangeDetectorRef //Permite detectar cambios en la vista
  ) { }

  //Método que inicializa el componente, carga el juego y los datos del formulario
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id'); //Obtiene el ID del juego de la ruta
    this.juegoId = idParam ? parseInt(idParam, 10) : null; //Convierte el parámetro a número

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId); //Carga los datos del juego
    } else {
      this.ui.mostrarToast('ID del juego no válido', 'dark'); //Notifica si el ID no es válido
    }

    //Inicializa el formulario reactivo con sus campos
    this.editarJuegoForm = this.formBuilder.group({
      nombre: [''],
      descripcion: [''],
      nota_metacritic: [''],
      fecha_lanzamiento: [''],
      sitio_web: [''],
      tiendas: [[]],
      plataformas: [[]],
      generos: [[]],
      desarrolladoras: [[]],
      publishers: [[]],
    });

    this.cargarDatos(); //Carga los datos para los selects del formulario
  }

  //Método que recupera los datos del juego desde la API y actualiza el formulario
  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        this.juego = data.juego || data; //Asigna los datos del juego

        if (this.juego) {

          //Parsea los datos JSON a objetos para cada campo
          this.juego.tiendas = this.ui.parseJsonData(this.juego.tiendas);
          this.juego.plataformas_principales = this.ui.parseJsonData(this.juego.plataformas_principales);
          this.juego.generos = this.ui.parseJsonData(this.juego.generos);
          this.juego.desarrolladoras = this.ui.parseJsonData(this.juego.desarrolladoras);
          this.juego.publishers = this.ui.parseJsonData(this.juego.publishers);

          if (!this.juego.publishers) this.juego.publishers = [];
          if (!this.juego.desarrolladoras) this.juego.desarrolladoras = [];
          if (!this.juego.generos) this.juego.generos = [];
          if (!this.juego.plataformas_principales) this.juego.plataformas_principales = [];
          if (!this.juego.tiendas) this.juego.tiendas = [];

          //Actualiza el formulario con los datos del juego
          this.editarJuegoForm.patchValue({
            descripcion: this.juego.descripcion,
            fecha_lanzamiento: this.juego.fecha_lanzamiento ? this.datePipe.transform(this.juego.fecha_lanzamiento, 'yyyy-MM-dd') : '',
            sitio_web: this.juego.sitio_web,
            nota_metacritic: this.juego.nota_metacritic,
            nombre: this.juego.nombre,
          });

          //Guarda los valores originales del formulario para comparaciones futuras
          this.valoresOriginales = { ...this.editarJuegoForm.getRawValue() };
        }
      },
      (error) => {
        this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
      }
    );
  }

  //Método que recupera los datos para los selects del formulario (géneros, plataformas, etc.)
  cargarDatos() {
    this.apiFacade.obtenerDatosFormulario().subscribe((response) => {
      this.generos = (response.generos || []).map((g: { id: string | number; nombre: any; }) => ({ id: +g.id, nombre: g.nombre }));
      this.plataformas = (response.plataformas || []).map((p: { id: string | number; nombre: any; }) => ({ id: +p.id, nombre: p.nombre }));
      this.tiendas = (response.tiendas || []).map((t: { id: string | number; nombre: any; }) => ({ id: +t.id, nombre: t.nombre }));
      this.desarrolladoras = (response.desarrolladoras || []).map((d: { id: string | number; nombre: any; }) => ({ id: +d.id, nombre: d.nombre }));
      this.publishers = (response.publishers || []).map((p: { id: string | number; nombre: any; }) => ({ id: +p.id, nombre: p.nombre }));
    });
  }

  //Método que valida el formulario y envía los datos actualizados del juego a la API
  editarJuego() {
    if (this.editarJuegoForm.valid) {
      const formValues = this.editarJuegoForm.value; //Obtiene los valores del formulario

      //Prepara los datos del juego para la actualización
      const juegoData: any = {
        id: this.juego.id,
        nombre: formValues.nombre,
        nota_metacritic: formValues.nota_metacritic,
        fecha_lanzamiento: formValues.fecha_lanzamiento,
        sitio_web: formValues.sitio_web,
        descripcion: formValues.descripcion,
        plataformas: formValues.plataformas?.length
          ? this.ui.extraerIdNombre(formValues.plataformas, this.plataformas)
          : this.juego.plataformas_principales,
        desarrolladoras: formValues.desarrolladoras?.length
          ? this.ui.extraerIdNombre(formValues.desarrolladoras, this.desarrolladoras)
          : this.juego.desarrolladoras,
        publishers: formValues.publishers?.length
          ? this.ui.extraerIdNombre(formValues.publishers, this.publishers)
          : this.juego.publishers,
        tiendas: formValues.tiendas?.length
          ? this.ui.extraerIdNombre(formValues.tiendas, this.tiendas)
          : this.juego.tiendas,
        generos: formValues.generos?.length
          ? this.ui.extraerIdNombre(formValues.generos, this.generos)
          : this.juego.generos,
      };

      const formData = new FormData(); //Crea un objeto FormData para enviar la información

      //Itera sobre los datos del juego y los añade a formData
      for (const key in juegoData) {
        if (Array.isArray(juegoData[key])) {
          formData.append(key, JSON.stringify(juegoData[key]));
        } else if (juegoData[key] !== null && juegoData[key] !== undefined) {
          formData.append(key, juegoData[key]);
        }
      }

      if (this.imagenArchivo) {
        formData.append('imagen', this.imagenArchivo); //Añade la imagen si está seleccionada
      }

      this.apiFacade.editarJuego(formData).subscribe(
        (response) => {
          this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa'); //Notifica el éxito de la actualización
          this.router.navigateByUrl('/home').then(() => window.location.reload()); //Navega a Home y recarga la página
        },
        (error) => {
          this.ui.mostrarRespuestaError(error, 'Operación errónea'); //Notifica el error al usuario
        }
      );
    } else {
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente', 'dark'); //Notifica si el formulario es inválido
    }
  }

  //Método que asigna el archivo de imagen seleccionado
  onImageSelected(event: any): void {
    const file = event.target.files[0]; //Obtiene el archivo seleccionado
    if (file) {
      this.imagenArchivo = file; //Asigna el archivo a la variable correspondiente
    }
  }

  //Método que compara los valores actuales del formulario con los originales para detectar modificaciones
  hayCambios(): boolean {
    const valoresActuales = this.editarJuegoForm.getRawValue(); //Obtiene los valores actuales

    return Object.keys(valoresActuales).some(key => {
      const original = this.normalizarValor(this.valoresOriginales[key]);
      const actual = this.normalizarValor(valoresActuales[key]);

      if (Array.isArray(original) || Array.isArray(actual)) {
        return JSON.stringify(original || []) !== JSON.stringify(actual || []);
      }

      return original !== actual;
    });
  }

  //Método que normaliza el valor para la comparación (string, number o Date)
  private normalizarValor(valor: any): any {
    if (valor === null || valor === undefined) return '';

    if (typeof valor === 'string') return valor.trim();

    if (typeof valor === 'number') return valor.toString(); //Convierte números a string para comparar

    if (valor instanceof Date) return this.datePipe.transform(valor, 'yyyy-MM-dd');

    return valor;
  }

  //Método que verifica si el formulario es válido y si se han realizado cambios o se ha seleccionado una imagen
  puedeEnviar(): boolean {
    return this.editarJuegoForm.valid && (this.hayCambios() || this.imagenArchivo !== null);
  }

  //Método que elimina la imagen seleccionada y resetea el input de archivo
  eliminarImagen() {
    this.imagenArchivo = null; //Remueve la imagen

    const inputFile = document.getElementById('input-imagen') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = ''; //Limpia el contenido del input de archivo
    }

    this.cdr.detectChanges(); //Fuerza la detección de cambios en la vista
  }

}
