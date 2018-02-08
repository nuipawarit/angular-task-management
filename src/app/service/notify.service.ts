import {Injectable} from '@angular/core';

declare var $: any;

@Injectable()
export class NotifyService {
  audio = new Audio('assets/sound/Chord0.mp3');

  constructor() { }

  default(msg, icon, setting): void {
    this._notify('notify', msg, icon, setting);
  }

  info(msg, icon, setting): void {
    this._notify('info', msg, icon, setting);
  }

  success(msg, icon, setting): void {
    this._notify('success', msg, icon, setting);
  }

  warning(msg, icon, setting): void {
    this._notify('warning', msg, icon, setting);
  }

  danger(msg, icon, setting): void {
    this._notify('danger', msg, icon, setting);
  }

  private _notify(type, msg, icon, setting): void {
    $.notify({
          icon: (icon || 'fa fa-info'),
          title: ' ' + (msg || ''),
          message: ''
        },
        $.extend({
          placement: {
            from: 'bottom',
            align: 'left'
          },
          spacing: 7,
          type: (type || 'notify'),
          z_index: 9999,
          delay: 10000,
          mouse_over: 'pause',
          onClick: null,
          animate: {
            enter: 'fadeInDown',
            exit: '' // 'fadeOutDown',
          },
          template: '' +
          '<div data-notify="container" ' +
          'class="col-xs-11 col-sm-6 col-md-4 col-lg-3 alert alert-{0}" style="max-width: 300px;" ' +
          'role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="title">{1}</span> ' +
          '<div data-notify="message">{2}</div>' + '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'

        }, setting)
    );

    if (setting.sound !== false) {
      this.audio.volume = 0.5;
      this.audio.play();
    }
  }
}
