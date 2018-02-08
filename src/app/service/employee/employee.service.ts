import {Injectable} from '@angular/core';
import {CacheAbleHttpData} from '../cache-able-http-data';
import {HttpClientService} from '../http-client/http-client.service';
import {Employee} from './employee';

@Injectable()
export class EmployeeService extends CacheAbleHttpData<Employee[]> {

  constructor(protected http: HttpClientService) {
    super(http, 'employee');
  }

  getAllEmployee(): Promise<Employee[]> {
    return this.getData();
  }
}
