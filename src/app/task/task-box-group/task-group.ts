import {Task} from '../../service/task/task';

export class TaskGroup {
  id: string;
  reponseBy?: number;
  reponseByEmpKey?: number;
  priority?: number;
  icon?: string;
  class: string;
  name: string;
  isOpen: boolean;
  tasks: Task[];
}
