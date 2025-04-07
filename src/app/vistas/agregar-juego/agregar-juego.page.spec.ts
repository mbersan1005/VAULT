import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarJuegoPage } from './agregar-juego.page';

describe('AgregarJuegoPage', () => {
  let component: AgregarJuegoPage;
  let fixture: ComponentFixture<AgregarJuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarJuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
