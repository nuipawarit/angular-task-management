import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {TaskModalComponent} from '../../task/task-modal/task-modal.component';
import {Task} from '../task/task';

@Injectable()
export class TaskModalService {

  constructor(private modalService: BsModalService) { }

  open(mode: string, task?: Task | Promise<Task | false>, config: ModalOptions = {}, readonly?: boolean): void {
    const defaultConfig = {
      animation: true,
      class: 'task-modal ' + mode + '-mode',
      backdrop: 'static'
    };
    const modalConfig = Object.assign(defaultConfig, config);
    const modalRef: BsModalRef = this.modalService.show(TaskModalComponent, modalConfig);
    const modalComponent: TaskModalComponent = modalRef.content;
    modalComponent.init(mode, task, readonly);
    // modalComponent.onSubmitted.subscribe((data) => this.onEstimateSubmitted(data));
  }

  openAddTaskModel(): void {
    this.open('add', null, {class: 'task-modal add-model has-footer'});
  }
}
