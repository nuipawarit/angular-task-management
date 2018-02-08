import { TestBed, inject } from '@angular/core/testing';

import { TaskModalService } from './task-modal.service';

describe('TaskModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskModalService]
    });
  });

  it('should be created', inject([TaskModalService], (service: TaskModalService) => {
    expect(service).toBeTruthy();
  }));
});
