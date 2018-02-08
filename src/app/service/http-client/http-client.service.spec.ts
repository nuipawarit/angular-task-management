import {inject, TestBed} from '@angular/core/testing';
import {HttpModule} from '@angular/http';
import {LocalStorageModule} from 'angular-2-local-storage';

import {HttpClientService} from './http-client.service';

describe('HttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        LocalStorageModule.withConfig({
          prefix: 'task-v3-test',
          storageType: 'localStorage'
        })
      ],
      providers: [HttpClientService]
    });
  });

  it('should be created', inject([HttpClientService], (service: HttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
