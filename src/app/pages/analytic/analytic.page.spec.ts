import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticPage } from './analytic.page';

describe('AnalyticPage', () => {
  let component: AnalyticPage;
  let fixture: ComponentFixture<AnalyticPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnalyticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
