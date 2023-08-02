import { TestBed } from '@angular/core/testing';

import { UpdateGuard } from './update.guard';

describe('UpdateGuard', () => {
  let guard: UpdateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UpdateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
