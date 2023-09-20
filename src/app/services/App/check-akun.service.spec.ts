import { TestBed } from '@angular/core/testing';

import { CheckAkunService } from './check-akun.service';

describe('CheckAkunService', () => {
  let service: CheckAkunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckAkunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
