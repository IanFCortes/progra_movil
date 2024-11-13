import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeCPage } from './home-c.page';

describe('HomeCPage', () => {
  let component: HomeCPage;
  let fixture: ComponentFixture<HomeCPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
