import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearMensajePage } from './crear-mensaje.page';

describe('CrearMensajePage', () => {
  let component: CrearMensajePage;
  let fixture: ComponentFixture<CrearMensajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMensajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
