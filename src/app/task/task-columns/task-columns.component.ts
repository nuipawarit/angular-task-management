import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {TaskColumn} from './task-column';

@Component({
  selector: 'app-task-columns',
  templateUrl: './task-columns.component.html',
  styleUrls: ['./task-columns.component.less']
})
export class TaskColumnsComponent implements OnInit {
  @Input() columns: TaskColumn[];
  @Input() hasGroup: boolean = false;
  @Input() groupBy: string;
  @Input() searchText: string;
  avatarUrl: string = environment.avatarUrl;

  constructor() { }

  ngOnInit() {
  }

}
