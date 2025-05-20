import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
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

  juegoId: number | null = null;
  juego: any = {};

  editarJuegoForm!: FormGroup;
  generos: { id: number, nombre: string }[] = [];
  plataformas: { id: number, nombre: string }[] = [];
  tiendas: { id: number, nombre: string }[] = [];
  desarrolladoras: { id: number, nombre: string }[] = [];
  publishers: { id: number, nombre: string }[] = [];
  imagenArchivo: File | null = null;

  private valoresOriginales: any = {};


  constructor(
    private router: Router,
    private apiFacade: ApiFacade,
    public apiRequestService: ApiRequestService,
    private ui: UiService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.juegoId = idParam ? parseInt(idParam, 10) : null;

    if (this.juegoId !== null && !isNaN(this.juegoId)) {
      this.cargarJuego(this.juegoId);
    } else {
      this.ui.mostrarToast('ID del juego no válido', 'dark');
    }

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

    this.cargarDatos();

  }

  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        console.log('Datos del juego recibido desde la API:', data);
        this.juego = data.juego || data;
  
        console.log('Juego cargado:', this.juego);
  
        if (this.juego) {

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

          this.editarJuegoForm.patchValue({
            descripcion: this.juego.descripcion,
            fecha_lanzamiento: this.juego.fecha_lanzamiento ? this.datePipe.transform(this.juego.fecha_lanzamiento, 'yyyy-MM-dd') : '',
            sitio_web: this.juego.sitio_web,
            nota_metacritic: this.juego.nota_metacritic,   
            nombre: this.juego.nombre,   
          });

          this.valoresOriginales = { ...this.editarJuegoForm.getRawValue() };
          
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        this.ui.mostrarRespuestaError(error, 'Operación errónea');
      }
    );
  }
  
  cargarDatos() {
    this.apiFacade.obtenerDatosFormulario().subscribe((response) => {
      this.generos = (response.generos || []).map((g: { id: string | number; nombre: any; }) => ({ id: +g.id, nombre: g.nombre }));
      this.plataformas = (response.plataformas || []).map((p: { id: string | number; nombre: any; }) => ({ id: +p.id, nombre: p.nombre }));
      this.tiendas = (response.tiendas || []).map((t: { id: string | number; nombre: any; }) => ({ id: +t.id, nombre: t.nombre }));
      this.desarrolladoras = (response.desarrolladoras || []).map((d: { id: string | number; nombre: any; }) => ({ id: +d.id, nombre: d.nombre }));
      this.publishers = (response.publishers || []).map((p: { id: string | number; nombre: any; }) => ({ id: +p.id, nombre: p.nombre }));
      
    });
  }

  editarJuego() {
    if (this.editarJuegoForm.valid) {
      const formValues = this.editarJuegoForm.value;
  
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
      
  
      const formData = new FormData();
  
      for (const key in juegoData) {
        if (Array.isArray(juegoData[key])) {
          formData.append(key, JSON.stringify(juegoData[key]));
        } else if (juegoData[key] !== null && juegoData[key] !== undefined) {
          formData.append(key, juegoData[key]);
        }
      }
  
      if (this.imagenArchivo) {
        formData.append('imagen', this.imagenArchivo);
      }
  
      console.log('Contenido de FormData:');
      for (const [key, value] of (formData as any).entries()) {
        console.log(`${key}:`, value);
      }

      this.apiFacade.editarJuego(formData).subscribe(
        (response) => {
          this.ui.mostrarRespuestaExitosa(response, 'Operación exitosa');
          this.router.navigateByUrl('/home').then(() => window.location.reload());
        },
        (error) => {
          console.error('Error al actualizar el juego:', error);
          this.ui.mostrarRespuestaError(error, 'Operación errónea');
        }
      );
    } else {
      this.ui.mostrarToast('Por favor, complete todos los campos correctamente', 'dark');
    }
  }
  
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenArchivo = file;
    }
  }
  
  hayCambios(): boolean {
    const valoresActuales = this.editarJuegoForm.getRawValue();
  
    return Object.keys(valoresActuales).some(key => {
      const original = this.normalizarValor(this.valoresOriginales[key]);
      const actual = this.normalizarValor(valoresActuales[key]);
  
      if (Array.isArray(original) || Array.isArray(actual)) {
        return JSON.stringify(original || []) !== JSON.stringify(actual || []);
      }
  
      return original !== actual;
    });
  }
  
  private normalizarValor(valor: any): any {
    if (valor === null || valor === undefined) return '';
    
    if (typeof valor === 'string') return valor.trim();
    
    if (typeof valor === 'number') return valor.toString(); // convierte números a string para comparar
    
    if (valor instanceof Date) return this.datePipe.transform(valor, 'yyyy-MM-dd');
  
    return valor;
  }
  
  

}
