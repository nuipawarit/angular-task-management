import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FullScreenService} from '../../service/full-screen.service';
import {NotificationService} from '../../service/notification/notification.service';
import {TaskModalService} from '../../service/task-modal/task-modal.service';
import {Task} from '../../service/task/task';
import {TaskService} from '../../service/task/task.service';
import {TaskFilter} from '../task-filter';
import {TaskTypeClass} from '../task-type';

const STATIC_TASK_FILTER = {
  taskType: [1, 3, 5, 7],
  completeTaskOnly: false,
  approvalPendingOnly: true
};

@Component({
  selector: 'app-approval-pendding-task',
  templateUrl: './approval-pendding-task.component.html',
  styleUrls: ['./approval-pendding-task.component.less'],
  providers: [FullScreenService]
})
export class ApprovalPenddingTaskComponent implements OnInit, OnDestroy {
  fullScreenMode: boolean = false;
  tasks: Task[];
  taskFilter: TaskFilter;
  TaskTypeClass = TaskTypeClass;
  streamTaskSubs: Subscription;

  constructor(private fullScreenService: FullScreenService,
              private taskService: TaskService,
              private taskModalService: TaskModalService,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.streamTaskSubs)
      this.streamTaskSubs.unsubscribe();
  }

  fullScreenToggle(mode: boolean): void {
    this.fullScreenMode = mode;
    this.fullScreenService.fullScreenToggle(this.fullScreenMode);
  }

  getTaskData(filter: TaskFilter): void {
    this.taskFilter = filter;
    const completeTaskFilter: TaskFilter = Object.assign({}, this.taskFilter, STATIC_TASK_FILTER);
    this.tasks = null;

    if (this.streamTaskSubs)
      this.streamTaskSubs.unsubscribe();

    this.streamTaskSubs = this.taskService.getStreamTask(completeTaskFilter).subscribe((result) => {
      this.tasks = [...result.sort((a, b) => b.TaskID - a.TaskID)];
    });
  }

  getRowClass(row) {
    return {'disabled': !row.SupportedType};
  }

  onActivate(event): void {
    if (event.type === 'click') {
      if (!!event.row.SupportedType) {
        this.editTask(event.row);
      }
    }
  }

  editTask(task: Task): void {
    const readonly = (!!task.TaskIsCompleted === true);
    this.taskModalService.open('edit', task, {}, readonly);
    this.notificationService.markReaded({taskID: task.TaskID});
  }
}
