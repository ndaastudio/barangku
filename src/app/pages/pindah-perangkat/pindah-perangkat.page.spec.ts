import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PindahPerangkatPage } from './pindah-perangkat.page';

describe('PindahPerangkatPage', () => {
  let component: PindahPerangkatPage;
  let fixture: ComponentFixture<PindahPerangkatPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PindahPerangkatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
