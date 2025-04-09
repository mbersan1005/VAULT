import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarJuegoPage } from './editar-juego.page';

describe('EditarJuegoPage', () => {
  let component: EditarJuegoPage;
  let fixture: ComponentFixture<EditarJuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarJuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
