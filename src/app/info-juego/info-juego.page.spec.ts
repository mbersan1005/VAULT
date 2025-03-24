import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoJuegoPage } from './info-juego.page';

describe('InfoJuegoPage', () => {
  let component: InfoJuegoPage;
  let fixture: ComponentFixture<InfoJuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoJuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
