import {Injectable} from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';

@Injectable()
export class TagService extends CacheAbleHttpData<string[]> {

  constructor(protected http: HttpClientService) {
    super(http, 'tag');
  }

  getAllTag(): Promise<string[]> {
    return this.getData();
  }

}
