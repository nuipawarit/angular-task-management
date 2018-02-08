import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Notification} from '../../service/notification/notification';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.less']
})
export class NotificationListComponent implements OnInit {
  @Input() data: Notification[];
  @Input() markReadBtn: boolean = false;
  @Input() maxHeight: string = '400px';
  @Output() listClick: EventEmitter<Notification> = new EventEmitter();
  @Output() markReadClick: EventEmitter<Notification> = new EventEmitter();
  @Output() onScrollToBottom: EventEmitter<Event> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onListClick(noti: Notification): void {
    event.preventDefault();
    this.listClick.emit(noti);
  }

  onMarkReadBtnClick(noti: Notification): void {
    event.preventDefault();
    event.stopPropagation();
    this.markReadClick.emit(noti);
  }

  onScroll(): void {
    const dom: any = event.target;
    if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
      this.onScrollToBottom.emit(event);
    }
  }
}
