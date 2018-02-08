import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {ConfirmModalSetting} from '../service/confirm-model/confirm-modal-setting';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.less']
})
export class ConfirmModalComponent implements OnInit {
  title: string;
  content: string;
  confirmCallback: (message?: string) => void;
  messageBox: boolean;
  messageRequire: boolean;
  message: string;

  constructor(private modalRef: BsModalRef) { }

  ngOnInit() {
  }

  init(setting: ConfirmModalSetting) {
    this.title = setting.title ? setting.title : null;
    this.content = setting.content ? setting.content : 'ต้องการยืนยันใช่หรือไม่ ?';
    this.confirmCallback = setting.confirmCallback ? setting.confirmCallback : null;
    this.messageBox = !!setting.messageBox;
    this.messageRequire = this.messageBox && !!setting.messageRequire;
  }

  confirm(): void {
    if (this.confirmCallback !== null) {
      if (this.messageBox) {
        this.confirmCallback(this.message);
      }
      else {
        this.confirmCallback();
      }
    }
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

}
