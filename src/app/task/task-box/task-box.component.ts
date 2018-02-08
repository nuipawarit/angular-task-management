import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from '../../service/notification/notification.service';
import {TaskModalService} from '../../service/task-modal/task-modal.service';
import {Task} from '../../service/task/task';
import {TaskTypeClass} from '../task-type';

@Component({
  selector: 'app-task-box',
  templateUrl: './task-box.component.html',
  styleUrls: ['./task-box.component.less']
})
export class TaskBoxComponent implements OnInit {
  @Input() task: Task;
  @Input() highlightText;
  TaskTypeClass = TaskTypeClass;

  constructor(private taskModalService: TaskModalService,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }


  editTask(task: Task): void {
    const readonly = (!!task.TaskIsCompleted === true);
    this.taskModalService.open('edit', task, {}, readonly);
    this.notificationService.markReaded({taskID: task.TaskID});
  }
}
