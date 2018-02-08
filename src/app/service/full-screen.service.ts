import {Injectable} from '@angular/core';

declare let $: any;

@Injectable()
export class FullScreenService {

  constructor() { }

  fullScreenToggle(mode: boolean): void {
    // Enable sidebar push menu
    const body = $('body');
    if (innerWidth > (768 - 1)) {
      if (body.hasClass('sidebar-collapse') && !mode) {
        body.removeClass('sidebar-collapse header-collapse');
        body.trigger('expanded.pushMenu');
        $.AdminLTE.layout.activate();
      }
      else if (!body.hasClass('sidebar-collapse') && mode) {
        body.addClass('sidebar-collapse header-collapse');
        body.trigger('collapsed.pushMenu');
        $.AdminLTE.layout.activate();
      }
    }
  }
}
