import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConfirmModalComponent} from '../../confirm-modal/confirm-modal.component';
import {ConfirmModalSetting} from './confirm-modal-setting';

@Injectable()
export class ConfirmModalService {

  constructor(private modalService: BsModalService) { }

  open(setting: ConfirmModalSetting): void {
    const modalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      class: 'confirm-modal',
      backdrop: 'static'
    });
    const modalComponent: ConfirmModalComponent = modalRef.content;
    modalComponent.init(setting);
  }

}
