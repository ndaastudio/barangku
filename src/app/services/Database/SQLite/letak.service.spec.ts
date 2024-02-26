import { TestBed } from '@angular/core/testing';

import { LetakService } from './letak.service';

describe('LetakService', () => {
  let service: LetakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
