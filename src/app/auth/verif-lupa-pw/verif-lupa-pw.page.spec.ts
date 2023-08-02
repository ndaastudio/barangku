import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifLupaPwPage } from './verif-lupa-pw.page';

describe('VerifLupaPwPage', () => {
  let component: VerifLupaPwPage;
  let fixture: ComponentFixture<VerifLupaPwPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerifLupaPwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
