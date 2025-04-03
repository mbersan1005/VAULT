import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuegosListaFiltroPage } from './juegos-lista-filtro.page';

describe('JuegosListaFiltroPage', () => {
  let component: JuegosListaFiltroPage;
  let fixture: ComponentFixture<JuegosListaFiltroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosListaFiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
