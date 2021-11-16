import { inject, TestBed } from '@angular/core/testing';

import { AlmacenamientoService } from './almacenamiento.service';

describe('AlmacenamientoService', () => {
  let service: AlmacenamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlmacenamientoService);
  });

  it('should be created', inject([AlmacenamientoService], (service: AlmacenamientoService) => {
    
    expect(service).toBeTruthy();
  }));
  
});
