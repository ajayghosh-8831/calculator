import { TestBed } from '@angular/core/testing';

import { ProbabilityService } from './probability.service';

describe('ProbabilityService', () => {
  let service: ProbabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProbabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
