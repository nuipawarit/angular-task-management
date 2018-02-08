import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/merge';
import {TaskFilter} from '../../task/task-filter';
import {UploadedFile} from '../attach-file/attach-file';
import {FileDownloadService} from '../file-download.service';
import {HttpClientService} from '../http-client/http-client.service';
import {RealTimeService} from '../realtime/realtime.service';
import {UserData} from '../user-data/user-data';
import {UserDataService} from '../user-data/user-data.service';
import {Task} from './task';

interface CreateTaskParam {
  task_type: number;
  title: string;
  detail: string;
  detail_temp_upload: UploadedFile[];
  task_attach: UploadedFile[];
  expect_date: string;
  priority: number;
  reponse_by: number;
  cc: string;
  tag: string;
  company: string;
  branch: number;
  approves: number[];
  customer: number;
  cus_contact_type: string;
  cus_credit: {
    amount: number;
    amount_old: number;
    due1: number;
    due1_old: number;
    due2: number;
    due2_old: number;
    due3: number;
    due3_old: number;
    due0: number;
    due0_old: number;
    due1_day: number;
    due1_day_old: number;
    due2_day: number;
    due2_day_old: number;
    approvers: number
  };
}

@Injectable()
export class TaskService {

  constructor(protected http: HttpClientService,
              private download: FileDownloadService,
              private realTimeService: RealTimeService,
              private userDataService: UserDataService) {
  }

  private _testFilter(task: Task, filter: TaskFilter, userData: UserData): boolean {

    // Filter By Complete Status
    if (task.TaskIsCompleted !== +filter.completeTaskOnly)
      return false;

    // Filter By Task Type
    if (!filter.taskType.includes(task.TaskType))
      return false;

    const approvalOnly = filter.approvalPendingOnly;
    const response_type = filter.reponseBy.split('-')[0];
    const response_id = +filter.reponseBy.split('-')[1];
    const isInCCList = task.TaskMail_CC.split(',').includes(userData.UserEmail);
    const isApprove = [+task.Ar_UserID1, +task.Ar_UserID2, +task.Ar_UserID3].includes(response_id);
    const isCloseApprove = (task.TaskCloseReq && task.TaskEmpIDCanCloseJob === response_id);
    const isResponse = (task.ReponsedBy === response_id);
    const isInDepartment = (task.ReponsedParID === response_id);

    // Filter By Response
    switch (response_type) {
      case 'a':
        break;

      case 'c':
        if (!isInCCList)
          return false;
        break;

      case 'e':
        if (approvalOnly) {
          if (!isApprove && !isCloseApprove)
            return false;
        }
        else {
          if (!isResponse)
            return false;
        }
        break;

      case 'd':
        if (approvalOnly) {
          if (!isApprove && !isCloseApprove)
            return false;
        }
        else {
          if (!isInDepartment)
            return false;
        }
        break;
    }

    // Filter By Search Text
    if (filter.searchText && !task.TaskTitle.includes(filter.searchText))
      return false;

    // Filter By Task Tag
    if (filter.tags.length > 0) {
      let notMatch = false;
      filter.tags.forEach((tag) => {
        if (task.TaskTypeName && task.TaskTypeName.replace(/ /g, '') !== tag &&
            task.TaskCategoryName && task.TaskCategoryName.replace(/ /g, '') !== tag &&
            !task.TaskTag.includes(tag))
          notMatch = true;
      });
      if (notMatch)
        return false;
    }

    // Filter By Assign
    if (filter.assignBy && filter.assignBy !== task.AssignedBy)
      return false;

    return true;
  }

  getTask(taskID: number): Promise<Task | false> {
    return this.http.get('task/' + taskID)
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  getTasks(filter: TaskFilter): Promise<Task[]> {
    const combinedFilter = {
      tag: filter.tags ? filter.tags.map(o => o.replace('#', '')) : [],
      search_text: filter.searchText || null,
      reponse_by: filter.reponseBy,
      assign_by: filter.assignBy || null,
      assign_date_after: filter.assignDateAfter || null,
      assign_date_before: filter.assignDateBefore || null,
      complete_date_after: filter.completeDateAfter || null,
      complete_date_before: filter.completeDateBefore || null,
      complete_task_only: filter.completeTaskOnly ? 1 : 0,
      approval_pendding_task_only: filter.approvalPendingOnly ? 1 : 0,
      task_type: filter.taskType.join(',')
    };

    return this.http.get('task', {filter: combinedFilter})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  getStreamTask(filter: TaskFilter): Observable<Task[]> {
    let tasks: Task[];
    let userData: UserData;
    const combinedFilter = {
      tag: filter.tags ? filter.tags.map(o => o.replace('#', '')) : [],
      search_text: filter.searchText || null,
      reponse_by: filter.reponseBy,
      assign_by: filter.assignBy || null,
      assign_date_after: filter.assignDateAfter || null,
      assign_date_before: filter.assignDateBefore || null,
      complete_date_after: filter.completeDateAfter || null,
      complete_date_before: filter.completeDateBefore || null,
      complete_task_only: filter.completeTaskOnly ? 1 : 0,
      approval_pendding_task_only: filter.approvalPendingOnly ? 1 : 0,
      task_type: filter.taskType.join(',')
    };

    const taskRealTime = Observable.fromPromise((this.userDataService.getUserData()))
        .flatMap((result) => {
          userData = result;
          return this.realTimeService.message;
        })
        .filter((updateData) => (updateData.table === 'task' && tasks !== undefined))
        .map((updateData) => {
          const taskID = +updateData.filter_key.TaskID;
          const newData = updateData.value;
          let targetIndex;

          switch (updateData.type) {
            case 'update' :
              if ((targetIndex = tasks.findIndex(task => task.TaskID === taskID)) > -1) {
                const newTaskData: Task = Object.assign({}, tasks[targetIndex], newData);
                if (this._testFilter(newTaskData, filter, userData)) {
                  tasks[targetIndex] = newTaskData;
                  return [tasks, true];
                }
                else {
                  tasks.splice(targetIndex, 1);
                  return [tasks, true];
                }
              }
              else {
                // Add New Item
                return [taskID, false];
              }

            case 'insert' :
              if (this._testFilter(newData, filter, userData)) {
                tasks.push(newData);
                return [tasks, true];
              }
              break;

            case 'delete' :
              if ((targetIndex = tasks.findIndex(task => task.TaskID === taskID)) > -1) {
                tasks.splice(targetIndex, 1);
                return [tasks, true];
              }
              break;
          }
          return null;
        })
        .filter(result => result !== null)
        .flatMap((result) => {
          if (result[1]) {
            return Observable.of(result[0] as Task[]);
          }

          return Observable.fromPromise(this.getTask(result[0] as number)
              .then((task: Task) => {
                if (this._testFilter(task, filter, userData)) {
                  tasks.push(task);
                  return tasks;
                }
                return null;
              }))
              .filter(result2 => result2 !== null);
        });

    return this.http.get('task', {filter: combinedFilter})
        .map((result) => {
          tasks = Object.keys(result).map((key) => result[key]);
          return tasks;
        })
        .merge(taskRealTime);
  }

  printApproveForm(taskID: number): Promise<any> {
    return this.http.get('task/' + taskID + '/approveform', null, true)
        .toPromise()
        .then((response) => {
          this.download.handler(response);
          return response;
        });
  }

  requestTaskClose(taskID: number): Promise<any> {
    return this.http.put('task/' + taskID + '/closereq/1')
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  approveTaskClose(taskID: number): Promise<any> {
    return this.http.put('task/' + taskID + '/complete/1')
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  disapproveTaskClose(taskID: number): Promise<any> {
    return this.http.put('task/' + taskID + '/closereq/0')
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  approveTask(taskID: number, isApprove: boolean, message: string = null): Promise<any> {
    return this.http.put('task/' + taskID + '/approve/' + (isApprove ? '1' : '0'), {
      approveNote: message
    })
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editTaskTitle(taskID: number, title: string): Promise<any> {
    return this.http.put('task/' + taskID + '/title', {title: title})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editTaskDetail(taskID: number, detail: string, detailTempUpload: UploadedFile[]): Promise<any> {
    return this.http.put('task/' + taskID + '/detail', {
      detail: detail,
      detailTempUpload: detailTempUpload
    })
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editTaskContactType(taskID: number, contactType: string): Promise<any> {
    return this.http.put('task/' + taskID + '/contactType', {
      contactType: contactType
    })
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editExpectDate(taskID: number, expectDate: string): Promise<any> {
    return this.http.put('task/' + taskID + '/expectDate', {
      expectDate: expectDate
    })
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editPriority(taskID: number, priority: number): Promise<any> {
    return this.http.put('task/' + taskID + '/priority/' + priority)
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editReponsedBy(taskID: number, responseBy: number): Promise<any> {
    return this.http.put('task/' + taskID + '/responseBy/' + responseBy)
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editCC(taskID: number, cc: string): Promise<any> {
    return this.http.put('task/' + taskID + '/cc', {cc: cc})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  editTag(taskID: number, tag: string): Promise<any> {
    return this.http.put('task/' + taskID + '/tag', {tag: tag})
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  cancelTask(taskID: number): Promise<any> {
    return this.http.delete('task/' + taskID)
        .toPromise()
        .then((response) => {
          return response;
        });
  }

  createTask(param: CreateTaskParam): Promise<any> {
    return this.http.post('task', {data: param})
        .toPromise()
        .then((response) => {
          return response;
        });
  }
}
