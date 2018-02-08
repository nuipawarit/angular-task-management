import { Injectable } from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';
import {Company} from './company';

@Injectable()
export class CompanyService extends CacheAbleHttpData<Company[]> {

  constructor(protected http: HttpClientService) {
    super(http, 'company');
  }

  getAllCompany(): Promise<Company[]> {
    return this.getData();
  }

}
