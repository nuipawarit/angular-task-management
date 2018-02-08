import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

declare let $: any;

@Injectable()
export class HttpClientService {

  constructor(private ls: LocalStorageService,
              private http: HttpClient) {
  }

  createHeader(): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const token = this.ls.get('token');
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  get(url, params?, blob?) {
    const headers: HttpHeaders = this.createHeader();
    const options: any = {headers: headers, withCredentials: true};

    if (params !== undefined && params !== null) {
      options.params = new HttpParams({
        fromString: $.param(params)
      });
    }

    if (blob) {
      options.responseType = 'blob';
    }

    return this.http.get(environment.apiUrl + url, options)
        .catch(this._errorHandler);
  }

  post(url, data?) {
    let headers: HttpHeaders = this.createHeader();
    let body = null;

    if (data !== undefined && data !== null && data.toString() === '[object FormData]') {
      headers = headers.delete('Content-Type');
      body = data;
    }
    else if (data !== undefined && data !== null) {
      body = $.param(data);
    }

    const options = {headers: headers, withCredentials: true};

    return this.http.post(environment.apiUrl + url, body, options)
        .catch(this._errorHandler);
  }

  put(url, data?) {
    let headers: HttpHeaders = this.createHeader();
    let body: string = null;

    if (data !== undefined && data !== null && data.toString() === '[object FormData]') {
      headers = headers.delete('Content-Type');
      body = data;
    }
    else if (data !== undefined && data !== null) {
      body = $.param(data);
    }

    const options = {headers: headers, withCredentials: true};

    return this.http.put(environment.apiUrl + url, body, options)
        .catch(this._errorHandler);
  }

  delete(url, data?) {
    const headers: HttpHeaders = this.createHeader();
    const options = {headers: headers, withCredentials: true};

    return this.http.delete(environment.apiUrl + url, options)
        .catch(this._errorHandler);
  }

  private _errorHandler(error) {
    if (error.status === 401) {
      // "Unauthorized"
      window.location.replace(environment.baseUrl + '#/login');
      return Observable.throw(error);
    }

    if (typeof error.error === 'string') {
      // String Type
      try {
        const result = JSON.parse(error.error);
        if (result && result.message) {
          alert(result.message);
        }
      }
      catch (err) {
        const errorMsg = error.error.replace(/<(?:.|\n)*?>/gm, '').replace(/\n\s*\n/g, '\n\n');
        alert(errorMsg);
      }
    }
    else if (error.error instanceof Blob) {
      // Blob Type
      const reader = new FileReader();
      reader.addEventListener('loadend', (e: ProgressEvent) => {
        const srcElement: any = e.srcElement;
        const message = srcElement.result;

        try {
          const result = JSON.parse(message);
          if (result && result.message) {
            alert(result.message);
          }
        }
        catch (err) {
          alert(message);
        }
      });
      reader.readAsText(error.blob());
    }
    else {
      console.error(error);
      alert(error.message + '\n\n'
          + '--Error--' + '\n'
          + error.error.error + '\n\n'
          + '--Response--' + '\n'
          + error.error.text);
    }

    return Observable.throw(error);
  }
}
