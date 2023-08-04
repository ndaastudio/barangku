import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowJasaPage } from './show.page';

describe('ShowJasaPage', () => {
  let component: ShowJasaPage;
  let fixture: ComponentFixture<ShowJasaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowJasaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
