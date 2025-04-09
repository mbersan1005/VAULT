import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, MenuController, ModalController, ToastController } from '@ionic/angular';
import { ApiFacade } from 'src/app/facades/api.facade';
import { ApiRequestService } from 'src/app/requests/api.requests';

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

  constructor(
    private menu: MenuController,
    private router: Router,
    private apiFacade: ApiFacade,
    private modalController: ModalController,
    public apiRequestService: ApiRequestService,
    private toastController: ToastController,
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
      this.mostrarToast('ID del juego no válido', 'danger');
    }

    this.editarJuegoForm = this.formBuilder.group({
      nombre: [''],
      descripcion: [''],
      nota_metacritic: [''], 
      fecha_lanzamiento: [''],
      imagen: ['', [Validators.pattern('https?://.+')]],
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

  cargarJuego(id: number) {
    this.apiFacade.recibirDatosJuego(id).subscribe(
      (data) => {
        console.log('Datos del juego recibido desde la API:', data);
        this.juego = data.juego || data;
  
        console.log('Juego cargado:', this.juego);
  
        if (this.juego) {

          this.juego.tiendas = this.parseJsonData(this.juego.tiendas);
          this.juego.plataformas_principales = this.parseJsonData(this.juego.plataformas_principales);
          this.juego.generos = this.parseJsonData(this.juego.generos);
          this.juego.desarrolladoras = this.parseJsonData(this.juego.desarrolladoras);
          this.juego.publishers = this.parseJsonData(this.juego.publishers);
  
          if (!this.juego.publishers) this.juego.publishers = [];
          if (!this.juego.desarrolladoras) this.juego.desarrolladoras = [];
          if (!this.juego.generos) this.juego.generos = [];
          if (!this.juego.plataformas_principales) this.juego.plataformas_principales = [];
          if (!this.juego.tiendas) this.juego.tiendas = [];
  
          this.editarJuegoForm.patchValue({
            nombre: this.juego.nombre,
            descripcion: this.juego.descripcion,
            nota_metacritic: Number(this.juego.nota_metacritic),
            fecha_lanzamiento: this.juego.fecha_lanzamiento ? this.datePipe.transform(this.juego.fecha_lanzamiento, 'yyyy-MM-dd') : '',
            imagen: this.juego.imagen,
            sitio_web: this.juego.sitio_web,
            tiendas: this.juego.tiendas.map((t: any) => +t.id),
            plataformas: this.juego.plataformas_principales.map((p: any) => +p.id),
            generos: this.juego.generos.map((g: any) => +g.id),
          });
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

  public formatearFecha(fecha: string): string {
    const fechaFormateada = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    return fechaFormateada || fecha; 
  }

  isLastItem(array: any[], item: any): boolean {
    return array[array.length - 1] === item;
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
      let juegoData: any = { ...this.juego };
  
      if (!this.compararArrays(this.juego.publishers, formValues.publishers)) {
        juegoData.publishers = formValues.publishers.length ?
          this.extraerIdNombre(formValues.publishers, this.publishers) : this.juego.publishers;
      }
  
      if (!this.compararArrays(this.juego.desarrolladoras, formValues.desarrolladoras)) {
        juegoData.desarrolladoras = formValues.desarrolladoras.length ?
          this.extraerIdNombre(formValues.desarrolladoras, this.desarrolladoras) : this.juego.desarrolladoras;
      }
  
      if (formValues.nombre !== this.juego.nombre && formValues.nombre !== '') {
        juegoData.nombre = formValues.nombre;
      }
  
      if (formValues.descripcion !== this.juego.descripcion && formValues.descripcion !== '') {
        juegoData.descripcion = formValues.descripcion;
      }
  
      if (formValues.nota_metacritic !== this.juego.nota_metacritic && formValues.nota_metacritic != null) {
        juegoData.nota_metacritic = formValues.nota_metacritic || null;
      }
  
      if (formValues.fecha_lanzamiento !== this.juego.fecha_lanzamiento && formValues.fecha_lanzamiento !== '') {
        juegoData.fecha_lanzamiento = formValues.fecha_lanzamiento || null;
      }
  
      if (formValues.imagen !== this.juego.imagen && formValues.imagen !== '') {
        juegoData.imagen = formValues.imagen || null;
      }
  
      if (formValues.sitio_web !== this.juego.sitio_web && formValues.sitio_web !== '') {
        juegoData.sitio_web = formValues.sitio_web || null;
      }
  
      if (!this.compararArrays(this.juego.tiendas, formValues.tiendas)) {
        juegoData.tiendas = formValues.tiendas.length ? this.extraerIdNombre(formValues.tiendas, this.tiendas) : [];
      }
  
      if (!this.compararArrays(this.juego.plataformas_principales, formValues.plataformas)) {
        juegoData.plataformas_principales = formValues.plataformas.length ? this.extraerIdNombre(formValues.plataformas, this.plataformas) : [];
      }
  
      if (!this.compararArrays(this.juego.generos, formValues.generos)) {
        juegoData.generos = formValues.generos.length ? this.extraerIdNombre(formValues.generos, this.generos) : [];
      }
  
      if (Object.keys(juegoData).length === 0 || JSON.stringify(juegoData) === JSON.stringify(this.juego)) {
        this.mostrarToast('Debe editar al menos un dato.', 'warning');
        return; 
      }
  
      console.log('Datos a enviar:', juegoData);
  
      this.apiFacade.editarJuego(juegoData).subscribe(
        (response: any) => {
          console.log('Juego actualizado con éxito:', response);
          this.mostrarToast('Juego actualizado correctamente', 'success');
          this.router.navigateByUrl('/home').then(() => {
            window.location.reload();
          });
        },
        (error: any) => {
          console.error('Error al actualizar el juego:', error);
          this.mostrarToast('Error al actualizar el juego', 'danger');
        }
      );
    } else {
      this.mostrarToast('Por favor, complete todos los campos correctamente', 'danger');
    }
  }
  


  
  
  
  private compararArrays(a: any[], b: any[]): boolean {
    // Asegurarse de que todos los IDs sean números antes de comparar
    const idsA = (a || []).map(o => +o.id || +o).sort();
    const idsB = (b || []).map(o => +o.id || +o).sort();
    return JSON.stringify(idsA) === JSON.stringify(idsB);
  }

  private extraerIdNombre(idsSeleccionados: any[], fuente: { id: number, nombre: string }[]): { id: number, nombre: string }[] {
    return fuente.filter(item => idsSeleccionados.includes(item.id) || idsSeleccionados.includes(String(item.id))).map(item => ({
        id: item.id,
        nombre: item.nombre
    }));
  }


  getNombresDesarrolladoras(): string {
    return this.juego?.desarrolladoras?.map((d: any) => d.nombre).join(', ') || '';
  }
  
  getNombresPublishers(): string {
    return this.juego?.publishers?.map((p: any) => p.nombre).join(', ') || '';
  }  

}
