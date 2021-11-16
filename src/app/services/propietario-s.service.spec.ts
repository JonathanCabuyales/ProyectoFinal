import { TestBed } from '@angular/core/testing';

import { PropietarioSService } from './propietario-s.service';

describe('PropietarioSService', () => {
  let service: PropietarioSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropietarioSService);
  });

  it('should be created', (e) => {
    console.log(e);
    
    expect(service).toBeTruthy();
  });
});
