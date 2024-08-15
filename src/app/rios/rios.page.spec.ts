import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiosPage } from './rios.page';

describe('RiosPage', () => {
  let component: RiosPage;
  let fixture: ComponentFixture<RiosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
