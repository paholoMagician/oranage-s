import { TestBed } from '@angular/core/testing';

import { AulasEducativasService } from './aulas-educativas.service';

describe('AulasEducativasService', () => {
  let service: AulasEducativasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AulasEducativasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
