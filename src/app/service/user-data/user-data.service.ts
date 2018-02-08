import {Injectable} from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';
import {UserData} from './user-data';

@Injectable()
export class UserDataService extends CacheAbleHttpData<UserData> {

  constructor(protected http: HttpClientService) {
    super(http, 'userdata');
  }

  getUserData(): Promise<UserData> {
    return this.getData();
  }
}
