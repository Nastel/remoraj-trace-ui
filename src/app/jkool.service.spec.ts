import { TestBed } from '@angular/core/testing';

import { JkoolService } from './jkool.service';

describe('JkoolService', () => {
  let service: JkoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JkoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
