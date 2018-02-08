import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupByPipe} from 'ngx-pipes';
import {Subscription} from 'rxjs/Subscription';
import {FullScreenService} from '../../service/full-screen.service';
import {NotificationService} from '../../service/notification/notification.service';
import {TaskModalService} from '../../service/task-modal/task-modal.service';
import {Task} from '../../service/task/task';
import {TaskService} from '../../service/task/task.service';
import {TaskColumn} from '../task-columns/task-column';
import {TaskFilter} from '../task-filter';

const STATIC_TASK_FILTER = {
  taskType: [1, 3, 5, 7],
  completeTaskOnly: false,
  approvalPendingOnly: false
};

@Component({
  selector: 'app-task-by-priority',
  templateUrl: './task-by-priority.component.html',
  styleUrls: ['./task-by-priority.component.less'],
  providers: [FullScreenService, GroupByPipe]
})
export class TaskByPriorityComponent implements OnInit, OnDestroy {
  fullScreenMode: boolean = false;
  columns: TaskColumn[];
  columnHasGroup: boolean = false;
  columnGroupBy: string = 'ReponsedBy';
  taskFilter: TaskFilter;
  searchText: string;
  streamTaskSubs: Subscription;
  taskReadEventSubs: Subscription;
  tasks: Task[];
  routeSubs: Subscription;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private fullScreenService: FullScreenService,
              private notificationService: NotificationService,
              private taskModalService: TaskModalService) { }

  ngOnInit() {
    this.routeSubs = this.route
        .queryParams
        .subscribe(params => {
          if (params.id && +params.id > 0) {
            const taskID = +params.id;
            this.taskModalService.open('edit', this.taskService.getTask(taskID));
            this.notificationService.markReaded({taskID: taskID});
          }
        });
  }

  ngOnDestroy() {
    if (this.routeSubs)
      this.routeSubs.unsubscribe();

    if (this.streamTaskSubs)
      this.streamTaskSubs.unsubscribe();

    if (this.taskReadEventSubs)
      this.taskReadEventSubs.unsubscribe();
  }

  fullScreenToggle(mode: boolean): void {
    this.fullScreenMode = mode;
    this.fullScreenService.fullScreenToggle(this.fullScreenMode);
  }

  getTaskData(filter: TaskFilter): void {
    this.taskFilter = filter;
    this.searchText = filter.searchText;
    const completeTaskFilter: TaskFilter = Object.assign({}, this.taskFilter, STATIC_TASK_FILTER);
    this.columnHasGroup = (filter.reponseBy.substring(0, 2) !== 'e-');
    this.columns = null;

    if (this.streamTaskSubs)
      this.streamTaskSubs.unsubscribe();

    this.streamTaskSubs = this.taskService.getStreamTask(completeTaskFilter)
        .subscribe((result) => {
          this.tasks = result;
          this.columns = this._getColumn(this.tasks);
        });

    if (this.taskReadEventSubs)
      this.taskReadEventSubs.unsubscribe();

    this.taskReadEventSubs = this.notificationService.getTaskReadEvent()
        .subscribe((event: { id: number[] } | 'all') => {
          if (!this.tasks)
            return;

          if (event === 'all') {
            this.tasks.forEach((v, i) => {
              this.tasks[i]['HasNotify'] = 0;
            });
          }
          else {
            event.id.forEach((taskID) => {
              const index = this.tasks.findIndex(v => v.TaskID === taskID);
              if (index > -1) {
                this.tasks[index]['HasNotify'] = 0;
              }
            });
          }
          this.columns = this._getColumn(this.tasks);
        });
  }

  private _getColumn(tasks: Task[]): TaskColumn[] {
    return [
      {
        id: 'Pri:3',
        priority: 3,
        title: 'This Week',
        class: 'box-height-pri',
        icon: 'fa-hourglass-half',
        tasks: tasks.filter(task => task.TaskPriority === 3)
      },
      {
        id: 'Pri:2',
        priority: 2,
        title: 'This Month',
        class: 'box-medium-pri',
        icon: 'fa-hourglass-start',
        tasks: tasks.filter(task => task.TaskPriority === 2)
      },
      {
        id: 'Pri:1',
        priority: 1,
        title: 'Later',
        class: 'box-low-pri',
        icon: 'fa-hourglass-o',
        tasks: tasks.filter(task => (task.TaskPriority === 1 || task.TaskPriority === 0))
      }
    ];
  }
}
