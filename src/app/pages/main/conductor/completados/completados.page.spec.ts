import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletadosPage } from './completados.page';

describe('CompletadosPage', () => {
  let component: CompletadosPage;
  let fixture: ComponentFixture<CompletadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompletadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
