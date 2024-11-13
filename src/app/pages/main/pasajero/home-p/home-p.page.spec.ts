import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePPage } from './home-p.page';

describe('HomePPage', () => {
  let component: HomePPage;
  let fixture: ComponentFixture<HomePPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomePPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
