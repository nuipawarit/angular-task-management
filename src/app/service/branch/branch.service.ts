import {Injectable} from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';
import {Branch} from './branch';

@Injectable()
export class BranchService extends CacheAbleHttpData<Branch[]> {

  constructor(protected http: HttpClientService) {
    super(http, 'branch');
  }

  getAllBranch(): Promise<Branch[]> {
    return this.getData();
  }

}
