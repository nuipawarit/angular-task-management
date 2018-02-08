import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FullScreenService} from '../../service/full-screen.service';
import {NotificationService} from '../../service/notification/notification.service';
import {Task} from '../../service/task/task';
import {TaskService} from '../../service/task/task.service';
import {TaskColumn} from '../task-columns/task-column';
import {TaskFilter} from '../task-filter';
import {GroupByPipe} from 'ngx-pipes';

const STATIC_TASK_FILTER = {
  taskType: [1, 3, 5, 7],
  completeTaskOnly: false,
  approvalPendingOnly: false
};

@Component({
  selector: 'app-task-by-owner',
  templateUrl: './task-by-owner.component.html',
  styleUrls: ['./task-by-owner.component.css'],
  providers: [GroupByPipe, FullScreenService]
})
export class TaskByOwnerComponent implements OnInit, OnDestroy {
  fullScreenMode: boolean = false;
  columns: TaskColumn[];
  columnHasGroup: boolean = true;
  columnGroupBy: string = 'TaskPriority';
  taskFilter: TaskFilter;
  searchText: string;
  streamTaskSubs: Subscription;
  taskReadEventSubs: Subscription;
  tasks: Task[];

  constructor(private taskService: TaskService,
              private groupByPipe: GroupByPipe,
              private fullScreenService: FullScreenService,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
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
    this.columns = null;

    if (this.streamTaskSubs)
      this.streamTaskSubs.unsubscribe();

    this.streamTaskSubs = this.taskService.getStreamTask(completeTaskFilter).subscribe((result) => {
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
    const grouped = this.groupByPipe.transform(tasks, 'ReponsedBy');
    const result2: TaskColumn[] = [];
    Object.keys(grouped).forEach((key) => {
      const value = grouped[key];
      result2.push({
        id: 'Res:' + key,
        reponseBy: +key,
        reponsedByEmpKey: value[0].ReponsedEmpKey,
        title: value[0].ReponsedName,
        class: 'box-owner',
        tasks: value
      });
    });
    return result2.sort((a, b) => (typeof a.title === 'string' ? a.title.localeCompare(b.title) : 1));
  }
}
