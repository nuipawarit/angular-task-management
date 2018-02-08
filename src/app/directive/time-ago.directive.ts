import {Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {DateObjPipe} from '../pipe/date-obj.pipe';
import {DateTimeThaiPipe} from '../pipe/date-time-thai.pipe';
import {TimeThaiPipe} from '../pipe/time-thai.pipe';

@Directive({
  selector: '[appTimeAgo]',
  providers: [DateObjPipe, TimeThaiPipe, DateTimeThaiPipe]
})
export class TimeAgoDirective implements OnChanges, OnDestroy {
  @Input() appTimeAgo;
  timeAgo: Date;
  intervalID;

  constructor(private dateObjPipe: DateObjPipe,
              private timeThaiPipe: TimeThaiPipe,
              private dateTimeThaiPipe: DateTimeThaiPipe,
              private el: ElementRef) { }

  ngOnChanges(change: SimpleChanges) {
    if (change['appTimeAgo']) {
      this.timeAgo = this.dateObjPipe.transform(this.appTimeAgo);

      if (this.intervalID) {
        clearInterval(this.intervalID);
      }

      if (this.timeAgo) {
        this.updateTime();
        this.intervalID = setInterval(this.updateTime, 60000);
      }
      else {
        this.el.nativeElement.innerHTML = this.timeAgo;
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }

  // used to update the UI
  updateTime(): void {
    if (!this.timeAgo)
      return;

    const today: Date = new Date();
    const yesterday: Date = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const seconds = Math.floor((today.getTime() - this.timeAgo.getTime()) / 1000);
    const hour_interval = Math.floor(seconds / 3600);
    let formated;

    if (hour_interval < 1) {
      const minute_interval = Math.floor(seconds / 60);
      if (minute_interval < 2) {
        formated = 'เมื่อสักครู่นี้';
      }
      else {
        formated = 'เมื่อ ' + minute_interval + ' นาทีที่แล้ว';
      }
    }
    else if (hour_interval < 24) {
      formated = hour_interval + ' ชั่วโมงที่แล้ว';
    }
    else if (this.timeAgo.toDateString() === yesterday.toDateString()) {
      formated = 'เมื่อวานนี้ ' + this.timeThaiPipe.transform(this.timeAgo);
    }
    else {
      formated = this.dateTimeThaiPipe.transform(this.timeAgo);
    }

    this.el.nativeElement.innerHTML = formated;
  }
}
