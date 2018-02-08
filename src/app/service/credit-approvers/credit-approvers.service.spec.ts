import { TestBed, inject } from '@angular/core/testing';

import { CreditApproversService } from './credit-approvers.service';

describe('CreditApproversService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditApproversService]
    });
  });

  it('should be created', inject([CreditApproversService], (service: CreditApproversService) => {
    expect(service).toBeTruthy();
  }));
});
