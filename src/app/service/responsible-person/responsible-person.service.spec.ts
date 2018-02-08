import { TestBed, inject } from '@angular/core/testing';

import { ResponsiblePersonService } from './responsible-person.service';

describe('ResponsiblePersonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponsiblePersonService]
    });
  });

  it('should be created', inject([ResponsiblePersonService], (service: ResponsiblePersonService) => {
    expect(service).toBeTruthy();
  }));
});
