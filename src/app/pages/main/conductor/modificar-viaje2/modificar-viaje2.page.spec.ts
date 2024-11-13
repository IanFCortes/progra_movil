import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarViaje2Page } from './modificar-viaje2.page';

describe('ModificarViaje2Page', () => {
  let component: ModificarViaje2Page;
  let fixture: ComponentFixture<ModificarViaje2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModificarViaje2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
