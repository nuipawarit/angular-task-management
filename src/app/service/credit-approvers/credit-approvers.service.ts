import {Injectable} from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';
import {CreditApprovers} from './credit-approvers';

@Injectable()
export class CreditApproversService extends CacheAbleHttpData<CreditApprovers[]> {

  constructor(protected http: HttpClientService) {
    super(http, 'employee/approvers/credit');
  }

  getAllCreditApprovers(): Promise<CreditApprovers[]> {
    return this.getData();
  }

}
