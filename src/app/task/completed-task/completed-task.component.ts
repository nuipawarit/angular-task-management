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
  taskType: [1, 2, 3, 4, 5, 6, 7],
  completeTaskOnly: true,
  approvalPendingOnly: false
};

@Component({
  selector: 'app-completed-task',
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.less'],
  providers: [FullScreenService]
})
export class CompletedTaskComponent implements OnInit, OnDestroy {
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
      this.tasks = [...result
          .sort((a, b) => (typeof b.TaskCompleteDate === 'string' ? b.TaskCompleteDate.localeCompare(a.TaskCompleteDate) : 1))];
    });
  }

  getRowClass(row) {
    return {'disabled': !row.SupportedType};
  }

  onActivate(event): void {
    if (event.type === 'click') {
      if (!!event.row.SupportedType) {
        this.readTask(event.row);
      }
    }
  }

  readTask(task: Task): void {
    const readonly = (!!task.TaskIsCompleted === true);
    this.taskModalService.open('edit', task, {}, readonly);
    this.notificationService.markReaded({taskID: task.TaskID});
  }
}
