import { TestBed, inject } from '@angular/core/testing';

import { AttachFileService } from './attach-file.service';

describe('AttachFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachFileService]
    });
  });

  it('should be created', inject([AttachFileService], (service: AttachFileService) => {
    expect(service).toBeTruthy();
  }));
});
