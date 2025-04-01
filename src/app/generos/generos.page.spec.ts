import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerosPage } from './generos.page';

describe('GenerosPage', () => {
  let component: GenerosPage;
  let fixture: ComponentFixture<GenerosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
