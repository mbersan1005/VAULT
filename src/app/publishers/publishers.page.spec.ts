import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishersPage } from './publishers.page';

describe('PublishersPage', () => {
  let component: PublishersPage;
  let fixture: ComponentFixture<PublishersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
