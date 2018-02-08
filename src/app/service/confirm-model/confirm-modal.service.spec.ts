import { TestBed, inject } from '@angular/core/testing';

import { ConfirmModalService } from './confirm-modal.service';

describe('ConfirmModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmModalService]
    });
  });

  it('should be created', inject([ConfirmModalService], (service: ConfirmModalService) => {
    expect(service).toBeTruthy();
  }));
});
