import { TestBed } from '@angular/core/testing';

import { FormErrorCheckService } from './form-error-check.service';

describe('FormErrorCheckService', () => {
  let service: FormErrorCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormErrorCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
