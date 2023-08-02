import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TambahBarangPage } from './create.page';

describe('TambahBarangPage', () => {
  let component: TambahBarangPage;
  let fixture: ComponentFixture<TambahBarangPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TambahBarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
