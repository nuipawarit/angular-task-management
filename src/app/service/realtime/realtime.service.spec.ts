import { TestBed, inject } from '@angular/core/testing';

import { RealTimeService } from './realtime.service';

describe('RealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealTimeService]
    });
  });

  it('should be created', inject([RealTimeService], (service: RealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
