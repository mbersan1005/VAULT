import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesarrolladorasPage } from './desarrolladoras.page';

describe('DesarrolladorasPage', () => {
  let component: DesarrolladorasPage;
  let fixture: ComponentFixture<DesarrolladorasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesarrolladorasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
