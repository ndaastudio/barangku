import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TambahJasaPage } from './tambah-jasa.page';

describe('TambahJasaPage', () => {
  let component: TambahJasaPage;
  let fixture: ComponentFixture<TambahJasaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TambahJasaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
