import {Injectable} from '@angular/core';
import {Comment} from './comment';
import {HttpClientService} from '../http-client/http-client.service';

@Injectable()
export class CommentService {

  constructor(protected http: HttpClientService) {
  }

  getTaskComment(taskID: number): Promise<Comment[]> {
    return this.http.get('comment', {taskID: taskID})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  addComment(taskID: number, message: string, files: FileList, tempKey: string): Promise<any> {
    const formData = new FormData;
    formData.append('taskID', taskID + '');
    formData.append('message', message);
    formData.append('tempKey', tempKey);
    if (files) {
      Array.from(files).forEach((file, i) => {
        formData.append(`file[${i}]`, file, file.name);
      });
    }
    return this.http.post('comment', formData)
        .toPromise()
        .then((response) => {
          return response;
        });
  }
}
