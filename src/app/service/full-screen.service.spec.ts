import { TestBed, inject } from '@angular/core/testing';

import { FullScreenService } from './full-screen.service';

describe('FullScreenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FullScreenService]
    });
  });

  it('should be created', inject([FullScreenService], (service: FullScreenService) => {
    expect(service).toBeTruthy();
  }));
});
