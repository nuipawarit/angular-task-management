import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Notification} from '../../service/notification/notification';
import {NotificationService} from '../../service/notification/notification.service';
import {TaskService} from '../../service/task/task.service';
import {TaskModalComponent} from '../../task/task-modal/task-modal.component';

@Component({
  selector: 'app-notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.less']
})
export class NotificationManagerComponent implements OnInit, OnDestroy {
  @ViewChild('taskModel') taskModel: TaskModalComponent;
  notifications: Notification[];
  notificationSubscription;
  showFormPlaceHolder: boolean = true;
  needMore: Subject<{ fromTimeStamp: number }> = new Subject<{ fromTimeStamp: number }>();
  fetching: boolean = false;
  defaultFilter = {searchText: '', approveOnly: false, includeReaded: true, completed: false};
  filter: { searchText: string, approveOnly: boolean, includeReaded: boolean, completed: boolean }
      = JSON.parse(JSON.stringify(this.defaultFilter));

  constructor(private notificationService: NotificationService,
              private taskService: TaskService) { }

  ngOnInit() {
    this.getNotification();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription)
      this.notificationSubscription.unsubscribe();
  }

  getNotification(): void {
    if (this.notificationSubscription)
      this.notificationSubscription.unsubscribe();

    this.fetching = true;
    this.notifications = undefined;
    this.notificationSubscription = this.notificationService
        .getNotification({
          searchText: this.filter.searchText,
          approveOnly: (this.filter.approveOnly) ? 1 : 0,
          nonReadOnly: (this.filter.includeReaded) ? 0 : 1
        }, {chunkSize: 20, needMore: this.needMore})
        .subscribe((noti) => {
          this.fetching = false;

          if (!this.notifications || this.notifications.length === 0) {
            this.notifications = noti
                .sort((a, b) => (b.TaskNotiTS.localeCompare(a.TaskNotiTS)));
          }
          else {
            noti.filter(a => (this.notifications.findIndex((b) => {
              return JSON.stringify(a) === JSON.stringify(b);
            }) === -1))
                .forEach((v) => {
                  const index = this.notifications.findIndex((v2) => v2.TaskNotiID === v.TaskNotiID);
                  if (index > -1) {
                    this.notifications[index] = v;
                  }
                  else {
                    this.notifications.push(v);
                  }
                });
          }

        });
  }

  onScrollToBottom(): void {
    if (this.fetching)
      return;

    if (!this.notifications)
      return;

    const oldest = this.notifications.reduce((acc, v) => {
      const ts = +(new Date(v.TaskNotiTS));
      if (!acc)
        return (acc = v);

      if (+(new Date(acc.TaskNotiTS)) < ts)
        return acc;
      else
        return (acc = v);
    });

    this.fetching = true;
    this.needMore.next({fromTimeStamp: Math.round(+(new Date(oldest.TaskNotiTS)) / 1000)});
  }

  openTaskForm(taskID: number) {
    this.showFormPlaceHolder = false;
    this.taskModel.init('edit', this.taskService.getTask(taskID));
    this.notificationService.markReaded({taskID: taskID});
  }

  markNotiReaded(noti: Notification): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.markReaded({noti: noti});
  }

  resetFilter(): void {
    this.filter = JSON.parse(JSON.stringify(this.defaultFilter));
    this.getNotification();
  }
}
