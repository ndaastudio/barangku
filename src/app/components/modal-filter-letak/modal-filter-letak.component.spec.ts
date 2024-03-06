import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFilterLetakComponent } from './modal-filter-letak.component';

describe('ModalFilterLetakComponent', () => {
  let component: ModalFilterLetakComponent;
  let fixture: ComponentFixture<ModalFilterLetakComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFilterLetakComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFilterLetakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
