import { TestBed } from '@angular/core/testing';

import { FutbolInnService } from './futbol-inn.service';

describe('FutbolInnService', () => {
  let service: FutbolInnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutbolInnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
