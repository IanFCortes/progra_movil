import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasajesPage } from './pasajes.page';

describe('PasajesPage', () => {
  let component: PasajesPage;
  let fixture: ComponentFixture<PasajesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
