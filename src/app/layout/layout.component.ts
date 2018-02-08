import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {FcmService} from '../service/fcm.service';
import {HttpClientService} from '../service/http-client/http-client.service';
import {NotificationService} from '../service/notification/notification.service';
import {TaskModalService} from '../service/task-modal/task-modal.service';
import {Task} from '../service/task/task';
import {TaskService} from '../service/task/task.service';
import {UserData} from '../service/user-data/user-data';
import {UserDataService} from '../service/user-data/user-data.service';
import {TaskModalComponent} from '../task/task-modal/task-modal.component';

declare let $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  rendering: boolean;
  apiUrl: string;
  userData: UserData;
  inputTaskID: number;

  constructor(private http: HttpClientService,
              private userDataService: UserDataService,
              private taskModalService: TaskModalService,
              private taskService: TaskService,
              private notificationService: NotificationService,
              private fcm: FcmService) { }

  ngOnInit() {
    this.rendering = true;
    this.apiUrl = environment.apiUrl;
    this.userDataService.getUserData()
        .then((userData) => {
          this.userData = userData;
          this.rendering = false;

          // AdminLTE Init
          setTimeout(() => {
            if ($(window).width() < 1200) {
              $('body').addClass('sidebar-collapse').trigger('collapsed.pushMenu');
            }
            $.AdminLTE.layout.activate();
          }, 1000);
        });

    this.fcm.getPermission();
    this.fcm.receiveMessage();
  }

  ngAfterViewInit() {
    const body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    body.classList.add('skin-webtask');
  }

  ngOnDestroy() {
  }

  openTaskModal(taskID): void {
    this.taskService.getTask(taskID).then((task: Task | false) => {
      if (task !== false) {
        this.taskModalService.open('edit', task, {}, (task.TaskIsCompleted === 1));
        this.notificationService.markReaded({taskID: task.TaskID});
      }
      else {
        alert('ไม่สามารถเปิดงานได้');
        this.inputTaskID = null;
      }
    });
  }

  newTask(): void {
    event.preventDefault();
    this.taskModalService.openAddTaskModel();
  }
}
