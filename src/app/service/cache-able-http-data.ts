import 'rxjs/add/operator/toPromise';
import {HttpClientService} from './http-client/http-client.service';

export abstract class CacheAbleHttpData<T> {
  private _data: T;
  private _promise: Promise<T>;

  constructor(protected http: HttpClientService,
              private apiTarget: string,
              private apiParam?: any) {}

  getData(): Promise<T> {
    if (this._data) {
      return new Promise((resolve, reject) => {
        resolve(this._data);
      });
    }
    else if (this._promise) {
      return this._promise;
    }
    else {
      this._promise = this.http.get(this.apiTarget, this.apiParam)
          .toPromise()
          .then((response) => {
            // cache data
            this._data = response;
            return this._data;
          });
      return this._promise;
    }
  }

  clear(): void {
    this._data = undefined;
    this._promise = undefined;
  }
}
