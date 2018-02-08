import {Inject, Injectable} from '@angular/core';
import {inject} from '@angular/core/testing';
import {LocalStorageService} from 'angular-2-local-storage';
import {Subject} from 'rxjs/Subject';
import {ConfirmModalService} from '../confirm-model/confirm-modal.service';
import {NotifyService} from '../notify.service';

@Injectable()
export class RealTimeService {
  target: string = 'wss://' + window.location.hostname + ':9002';
  tryCount: number = 0;

  private _message: Subject<any> = new Subject();
  get message(): Subject<any> {
    return this._message;
  }

  constructor(private ls: LocalStorageService,
              private notifyService: NotifyService,
              private confirmModelService: ConfirmModalService,
              @Inject('REAL_TIME_SERVICE_CONFIG') private config?: { target?: string }) {
    if (this.config && this.config.target) {
      this.connect(this.config.target);
    }
    else {
      this.connect();
    }
  }

  connect(target?: string): Subject<any> {
    if (target) {
      this.target = target;
    }

    const socket = new WebSocket(this.target);

    socket.onopen = () => {
      if (this.tryCount > 1) {
        this.notifyService.success(
            'การเชื่อมต่อกลับมาปกติแล้ว',
            'fa fa-fw fa-check-circle',
            {
              'delay': 5000,
              'sound': false
            });
        this.tryCount = 0;
      }
      console.log('WS connection is opened');

      const token = this.ls.get('token');
      socket.send('Authorization: ' + 'Bearer ' + token);
      console.log('WS connection sending authorization token');

      return;
    };

    socket.onmessage = (msg) => {
      if (msg.data.toString().toLowerCase() === 'authorization successful') {
        console.log('WS connection authorization successful');
        return;
      }

      let message;
      try {
        message = JSON.parse(msg.data);
        console.log('WS message received', message);
        this._message.next(message);
      }
      catch (err) {
        if (err.name === 'SyntaxError')
          console.warn('WS message can\'t decode message', msg.data);
        else
          console.error(err);
      }
      return;
    };

    socket.onerror = (e) => {
      return;
    };

    socket.onclose = (e) => {
      if (e.code !== 1000) {
        if (this.tryCount >= 1) {
          this.notifyService.warning(
              'การเชื่อมต่อไม่เถียร [' + e.code + ']',
              'fa fa-fw fa-exclamation-circle',
              {
                'delay': 5000,
                'sound': false
              });
        }

        if (this.tryCount < 10) {
          setTimeout(() => {
            this.connect();
          }, 10000);
          this.tryCount++;
        }
        else {
          this.notifyService.danger(
              'การเชื่อมต่อมีปัญหา',
              'fa fa-fw fa-exclamation-circle',
              {
                allow_dismiss: false,
                'delay': 0,
                'sound': false
              });

          this.confirmModelService.open({
            title: '<i class="fa fa-exclamation-triangle text-red"></i> การเชื่อมต่อมีปัญหา',
            content: '<span class="text-muted">(คำแนะนำ) ลองปิด browser แล้วเปิดใหม่อีกครั้งเพื่อแก้ไขปัญหา หรือติดต่อผู้ดูแลระบบ</span>'
          });
        }
      }
      console.log('WS connection is closed', e);
      return;
    };

    return this._message;
  }
}
