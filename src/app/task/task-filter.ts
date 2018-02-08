export class TaskFilter {
  tags: string[];
  searchText: string;
  reponseBy: string;
  assignBy: number;
  assignDateAfter: string;
  assignDateBefore: string;
  completeDateAfter: string;
  completeDateBefore: string;
  taskType?: number[];
  completeTaskOnly?: boolean;
  approvalPendingOnly?: boolean;
}
