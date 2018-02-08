import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GroupByPipe} from 'ngx-pipes';
import {environment} from '../../../environments/environment';
import {Task} from '../../service/task/task';
import {TaskGroup} from './task-group';

@Component({
  selector: 'app-task-box-group',
  templateUrl: './task-box-group.component.html',
  styleUrls: ['./task-box-group.component.less'],
  providers: [GroupByPipe]
})
export class TaskBoxGroupComponent implements OnInit, OnChanges {
  @Input() tasks: Task[];
  @Input() groupBy: string;
  @Input() searchText: string;
  groups: TaskGroup[];
  avatarUrl: string = environment.avatarUrl;

  constructor(private groupByPipe: GroupByPipe) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks'] || changes['groupBy']) {
      this.groupTask(changes['tasks'].currentValue, changes['groupBy'].currentValue);
    }
  }

  groupTask(tasks: Task[], groupBy: string): void {
    if (groupBy === 'ReponsedBy') {
      const result: TaskGroup[] = [];
      const grouped = this.groupByPipe.transform(tasks, groupBy);
      Object.keys(grouped).forEach((key) => {
        const value = grouped[key];
        result.push({
          id: 'Res:' + key,
          reponseBy: +key,
          reponseByEmpKey: value[0].ReponsedEmpKey,
          name: value[0].ReponsedName,
          class: '',
          isOpen: true,
          tasks: value
        });
      });
      this.groups = result.sort((a, b) => (typeof a.name === 'string' ? a.name.localeCompare(b.name) : 1));
    }
    else if (groupBy === 'TaskPriority') {
      this.groups = [
        {
          id: 'Pri:3',
          priority: 3,
          name: 'This Week',
          class: 'text-height-pri',
          icon: 'fa-hourglass-half',
          isOpen: true, // hight_pri_task.length > 0,
          tasks: tasks.filter((o) => o.TaskPriority === 3)
        },
        {
          id: 'Pri:2',
          priority: 2,
          name: 'This Month',
          class: 'text-medium-pri',
          icon: 'fa-hourglass-start',
          isOpen: true, // medium_pri_task.length > 0,
          tasks: tasks.filter((o) => o.TaskPriority === 2)
        },
        {
          id: 'Pri:1',
          priority: 1,
          name: 'Later',
          class: 'text-low-pri',
          icon: 'fa-hourglass-o',
          isOpen: true, // low_pri_task.length > 0,
          tasks: tasks.filter((o) => (o.TaskPriority === 0 || o.TaskPriority === 1))
        }
      ];
    }
  }
}
