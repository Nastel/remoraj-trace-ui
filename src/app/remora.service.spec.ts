import { TestBed } from '@angular/core/testing';

import { RemoraService } from './remora.service';

describe('RemoraService', () => {
  let service: RemoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#addTrackedMethod should return OK', () => {
   // expect(service.addTrackedMethod("com.nastel.bank.DbUtils.getUserId()").then(data => expect(data).toBe("OK")));
  });
});
