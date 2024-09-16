import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertaDispositivoPage } from './alerta-dispositivo.page';

describe('AlertaDispositivoPage', () => {
  let component: AlertaDispositivoPage;
  let fixture: ComponentFixture<AlertaDispositivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaDispositivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
