import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/empty';
import {HttpClientService} from '../http-client/http-client.service';
import {NotifyService} from '../notify.service';
import {RealTimeService} from '../realtime/realtime.service';
import {TaskModalService} from '../task-modal/task-modal.service';
import {TaskService} from '../task/task.service';
import {Notification} from './notification';

const NOTI_ICON = {
  'new': 'fa-plus-square text-green',
  'edit.title': 'fa-pencil-square-o text-yellow',
  'edit.detail': 'fa-pencil-square-o text-yellow',
  'edit.expectdate': 'fa-calendar-check-o text-yellow',
  'edit.priority': 'fa-hourglass text-yellow',
  'edit.cc': 'fa-user text-yellow',
  'edit.reponseby': 'fa-user text-yellow',
  'edit.tag': 'fa-tags text-yellow',
  'edit.cus_contact_type': 'fa-book text-yellow',
  'edit.reponseby.priority': 'fa-pencil-square-o text-yellow',
  'comment': 'fa-comment-o text-primary',
  'comment.attach': 'fa-paperclip text-primary',
  'attach': 'fa-paperclip text-primary',
  'request': 'fa-flag text-orange',
  'approve': 'fa-flag text-teal',
  'reject': 'fa-flag text-red',
  'cancle': 'fa-trash-o text-red'
};

@Injectable()
export class NotificationService {
  taskReadEvent: Subject<{ id: number[] } | 'all'> = new Subject<{ id: number[] }>();

  constructor(protected http: HttpClientService,
              private realTimeService: RealTimeService,
              private notifyService: NotifyService,
              private taskModalService: TaskModalService,
              private taskService: TaskService) { }


  getNotification(params: {
                    searchText?: string,
                    approveOnly?: 0 | 1,
                    nonReadOnly?: 0 | 1,
                    awayIncludeApprovePending?: 0 | 1
                  },
                  chunk?: {
                    chunkSize: number,
                    needMore: Observable<{ fromTimeStamp: number }>
                  }): Observable<Notification[]> {

    let notification: Notification[];

    const messageObs = this.realTimeService.message
        .filter((updateData) => (updateData.table === 'notification' && notification !== undefined))
        .map((updateData) => {
          switch (updateData.type) {
            case 'update' :
              const filterKey = updateData.filter_key;
              const change = updateData.value;

              if (filterKey.TaskNotiID) {
                const index = notification.findIndex(v =>
                    v.TaskNotiID === filterKey.TaskNotiID
                );
                if (index > -1) {
                  notification[index] = Object.assign({}, notification[index], change);
                }
              }
              else if (filterKey.TaskID && filterKey.TaskEmpID) {
                notification.forEach((v, i) => {
                  if (v.TaskID === filterKey.TaskID && v.TaskEmpID === filterKey.TaskEmpID) {
                    notification[i] = Object.assign({}, notification[i], change);
                  }
                });
              }
              else {
                notification.forEach((v, i) => {
                  notification[i] = Object.assign({}, notification[i], change);
                });
              }
              break;

            case 'insert' :
              const taskID = updateData.filter_key.TaskID;
              const newData = updateData.value;
              const iconClass = NOTI_ICON[newData.TaskNotiType] || null;

              newData.iconClass = iconClass;
              notification.push(newData);
              this.notifyService.default(newData.TaskNotiMsg, 'fa fa-fw ' + iconClass,
                  {
                    'sound': true,
                    'onClick': () => {
                      this.taskModalService.open('edit', this.taskService.getTask(taskID));
                      this.markReaded({taskID: taskID});
                    }
                  });

              break;
          }
          return notification;
        });

    const taskReadObs = this.taskReadEvent
        .map((updateData: { id: number[] } | 'all') => {
          if (notification) {
            if (updateData === 'all') {
              let hasChange = false;
              notification.forEach((v, i, array) => {
                if (v.TaskNotiIsReaded === 0) {
                  array[i].TaskNotiIsReaded = 1;
                  hasChange = true;
                }
              });

              if (hasChange) {
                return notification;
              }
            }
            else {
              let hasChange = false;
              notification.forEach((v, i, array) => {
                if (updateData.id.includes(v.TaskID) && v.TaskNotiIsReaded === 0) {
                  array[i].TaskNotiIsReaded = 1;
                  hasChange = true;
                }
              });

              if (hasChange) {
                return notification;
              }
            }
          }

          return null;
        })
        .filter((notifications) => notifications !== null);

    if (chunk) {
      params['chunkSize'] = chunk.chunkSize;
    }

    const httpResponseManagement = function (response) {
      if (!notification) {
        notification = response.map((o) => {
          o.iconClass = NOTI_ICON[o.TaskNotiType] || null;
          return o;
        });
      }
      else {
        notification = notification.concat(response.map((o) => {
          o.iconClass = NOTI_ICON[o.TaskNotiType] || null;
          return o;
        }));
      }

      return notification;
    };

    const chunkObs = !chunk ? Observable.empty<Notification>() :
        chunk.needMore
            .flatMap((updateData: { fromTimeStamp: number }) => {
              return this.http
                  .get('notification',
                      Object.assign({}, params, {'fromTimeStamp': updateData.fromTimeStamp}));
            })
            .map(httpResponseManagement);

    return this.http.get('notification', params).map(httpResponseManagement)
        .merge(messageObs)
        .merge(taskReadObs)
        .merge(chunkObs);
  }

  getTaskReadEvent() {
    return this.taskReadEvent;
  }

  markReaded(param: { noti ?: Notification, taskID ?: number }): Promise<any> {
    if (param.noti) {
      this.taskReadEvent.next({id: [param.noti.TaskID]});
      return this.http.put('notification/' + param.noti.TaskNotiID + '/markreaded')
          .toPromise();
    }

    if (param.taskID) {
      this.taskReadEvent.next({id: [param.taskID]});
      return this.http.put('notification/markreaded/' + param.taskID).toPromise();
    }
  }

  markReadedAll(): Promise<any> {
    this.taskReadEvent.next('all');
    return this.http.put('notification/markreaded').toPromise();
  }
}
