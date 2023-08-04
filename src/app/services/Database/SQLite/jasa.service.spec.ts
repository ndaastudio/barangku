import { TestBed } from '@angular/core/testing';

import { JasaService } from './jasa.service';

describe('JasaService', () => {
  let service: JasaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JasaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
