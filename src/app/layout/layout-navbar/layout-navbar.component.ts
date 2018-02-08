import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Notification} from '../../service/notification/notification';
import {NotificationService} from '../../service/notification/notification.service';
import {TaskModalService} from '../../service/task-modal/task-modal.service';
import {Task} from '../../service/task/task';
import {TaskService} from '../../service/task/task.service';
import {UserData} from '../../service/user-data/user-data';
import {UserDataService} from '../../service/user-data/user-data.service';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styleUrls: ['./layout-navbar.component.less']
})
export class LayoutNavbarComponent implements OnInit, OnDestroy {
  userData: UserData;
  apiUrl: string = environment.apiUrl;
  avatarUrl: string = environment.avatarUrl;
  generalNotification: Notification[];
  approveNotification: Notification[];
  generalNotiUnreadCount: number = 0;
  notificationSubscription;

  constructor(private userDataService: UserDataService,
              private notificationService: NotificationService,
              private taskService: TaskService,
              private taskModalService: TaskModalService) { }

  ngOnInit() {
    this.userDataService.getUserData()
        .then((userData) => {
          this.userData = userData;
        });
    this.getNotification();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription)
      this.notificationSubscription.unsubscribe();
  }

  getNotification(): void {
    this.notificationSubscription = this.notificationService
        .getNotification({nonReadOnly: 1, awayIncludeApprovePending: 1})
        .subscribe((noti) => {
          const unread_count = noti.filter(v => v.TaskNotiIsReaded === 0).length;
          document.title = (unread_count > 0) ? ('(' + unread_count + ') ระบบทะเบียนงาน') : 'ระบบทะเบียนงาน';

          if (!this.generalNotification || this.generalNotification.length === 0) {
            this.generalNotification = noti
                .filter(v => v.TaskNotiType !== 'request')
                .sort((a, b) => (b.TaskNotiTS.localeCompare(a.TaskNotiTS)));
          }
          else {
            noti.filter(v => v.TaskNotiType !== 'request')
                .filter(a => (this.generalNotification.findIndex((b) => {
                  return JSON.stringify(a) === JSON.stringify(b);
                }) === -1))
                .forEach((v) => {
                  const index = this.generalNotification.findIndex((v2) => v2.TaskNotiID === v.TaskNotiID);
                  if (index > -1) {
                    this.generalNotification[index] = v;
                  }
                  else {
                    this.generalNotification.unshift(v);
                  }
                });
          }
          if (this.generalNotification)
            this.generalNotiUnreadCount = this.generalNotification.filter(v => v.TaskNotiIsReaded === 0).length;


          if (!this.approveNotification || this.approveNotification.length === 0) {
            this.approveNotification = noti
                .filter(v => v.TaskNotiType === 'request' && v.TaskClosePending === 1)
                .sort((a, b) => (b.TaskNotiTS.localeCompare(a.TaskNotiTS)));
          }
          else {
            noti.filter(v => v.TaskNotiType === 'request')
                .filter(a => (this.approveNotification.findIndex((b) => {
                  return JSON.stringify(a) === JSON.stringify(b);
                }) === -1))
                .forEach((v, i, arr) => {
                  const index = this.approveNotification.findIndex((v2) => v2.TaskNotiID === v.TaskNotiID);
                  if (v.TaskClosePending !== 1) {
                    if (index > -1) {
                      this.approveNotification.splice(index, 1);
                    }
                  }
                  else {
                    if (index > -1) {
                      this.approveNotification[index] = v;
                    }
                    else {
                      this.approveNotification.unshift(v);
                    }
                  }
                });
          }

        });
  }

  markNotiReaded(noti: Notification): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.markReaded({noti: noti});
  }

  markAllReaded(): void {
    event.preventDefault();
    this.notificationService.markReadedAll();
  }

  openTaskModal(taskID): void {
    event.preventDefault();
    this.taskModalService.open('edit', this.taskService.getTask(taskID));
    this.notificationService.markReaded({taskID: taskID});
  }
}
