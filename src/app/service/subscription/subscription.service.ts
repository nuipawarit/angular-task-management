import {Injectable} from '@angular/core';
import {HttpClientService} from '../http-client/http-client.service';

@Injectable()
export class SubscriptionService {

  constructor(protected http: HttpClientService) { }

  toggleSubscription(taskID: number, state: number): Promise<any> {
    return this.http.put('notification/subscription/' + taskID + '/' + state)
        .toPromise()
        .then((response) => {
          return response;
        });
  }
}
