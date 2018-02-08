import {Task} from '../../service/task/task';

export class TaskColumn {
  id: string;
  title: string;
  class: string;
  tasks: Task[];
  priority?: number;
  reponseBy?: number;
  reponsedByEmpKey?: number;
  icon?: string;
}
