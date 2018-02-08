import {HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {HttpClientService} from '../http-client/http-client.service';
import {AttachFile} from './attach-file';

@Injectable()
export class AttachFileService {

  constructor(protected http: HttpClientService,
              private httpClient: HttpClient) {
  }

  getAttachFile(taskID: number): Promise<AttachFile[]> {
    return this.http.get('attachFile', {taskID: taskID})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  uploadFile(taskID: number, files: FileList, promise: boolean = true): any {
    const url = 'attachfile';
    const headers: HttpHeaders = this.http.createHeader();
    let formData, req;
    formData = new FormData;
    formData.append('taskID', taskID + '');
    if (files instanceof File) {
      formData.append('Content-Type', files.type);
      formData.append('file', files, files.name);
    }
    else {
      Array.from(files).forEach((file, i) => {
        formData.append(`file[${i}]`, file, file.name);
      });
    }

    req = new HttpRequest('POST', environment.apiUrl + url, formData, {
      headers: headers.delete('Content-Type'),
      reportProgress: true,
      withCredentials: true
    });

    if (!promise) {
      return this.httpClient.request(req);
    }
    else {
      return new Promise(resolve => {
        this.httpClient.request(req).subscribe((event) => {
          if (event instanceof HttpResponse) {
            resolve(event);
          }
        });
      });
    }
  }

  uploadTmpFile(files: File | FileList, promise: boolean = true): (Observable<HttpEvent<any>> | Promise<HttpResponse<any>>) {
    const url = 'attachfile/tmpfile';
    const headers: HttpHeaders = this.http.createHeader();
    let form, req;

    form = new FormData;
    if (files instanceof File) {
      form.append('Content-Type', files.type);
      form.append('file', files, files.name);
    }
    else {
      Array.from(files).forEach((file, i) => {
        form.append(`file[${i}]`, file, file.name);
      });
    }

    req = new HttpRequest('POST', environment.apiUrl + url, form, {
      headers: headers.delete('Content-Type'),
      reportProgress: true,
      withCredentials: true
    });

    if (!promise) {
      return this.httpClient.request(req);
    }
    else {
      return new Promise(resolve => {
        this.httpClient.request(req).subscribe((event) => {
          if (event instanceof HttpResponse) {
            resolve(event);
          }
        });
      });
    }
  }
}
