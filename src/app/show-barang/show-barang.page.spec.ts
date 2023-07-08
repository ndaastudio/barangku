import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowBarangPage } from './show-barang.page';

describe('ShowBarangPage', () => {
  let component: ShowBarangPage;
  let fixture: ComponentFixture<ShowBarangPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowBarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
