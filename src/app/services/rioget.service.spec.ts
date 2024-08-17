import { TestBed } from '@angular/core/testing';

import { RiogetService } from './rioget.service';

describe('RiogetService', () => {
  let service: RiogetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiogetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
