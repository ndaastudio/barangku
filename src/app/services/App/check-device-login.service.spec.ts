import { TestBed } from '@angular/core/testing';

import { CheckDeviceLoginService } from './check-device-login.service';

describe('CheckDeviceLoginService', () => {
  let service: CheckDeviceLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckDeviceLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
