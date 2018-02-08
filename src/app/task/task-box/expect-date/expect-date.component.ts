import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DateObjPipe} from '../../../pipe/date-obj.pipe';
import {DateThaiPipe} from '../../../pipe/date-thai.pipe';

@Component({
  selector: 'app-expect-date',
  templateUrl: './expect-date.component.html',
  styleUrls: ['./expect-date.component.less'],
  providers: [DateObjPipe, DateThaiPipe]
})
export class ExpectDateComponent implements OnInit, OnChanges {
  @Input() date: string;
  color_class = '';
  icon_class = '';
  label = '';
  tooltip = '';

  constructor(private dateObjPipe: DateObjPipe,
              private dateThaiPipe: DateThaiPipe) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date']) {
      this.render();
    }
  }

  update(icon, label, tooltip?, color?): void {
    this.color_class = color || '';
    this.icon_class = icon;
    this.label = label;
    this.tooltip = tooltip || '';
  }

  render(): void {
    const dateObj: Date = this.dateObjPipe.transform(this.date);
    if (!dateObj) return;

    const oneDay = 86400000;
    const currentDate_TS = new Date().setHours(0, 0, 0, 0);
    const expectDate_TS = dateObj.getTime();
    const date_thai = this.dateThaiPipe.transform(dateObj);

    const day_diff = Math.round((expectDate_TS - currentDate_TS) / (oneDay));

    if (day_diff > 1) {
      this.update('fa fa-calendar-o', 'เหลือเวลาอีก ' + day_diff + ' วัน', date_thai);
    }
    else if (day_diff === 1) {
      this.update('fa fa-calendar-o', 'ภายในพรุ่งนี้', date_thai, 'text-warning');
    }
    else if (day_diff === 0) {
      this.update('fa fa-calendar-o', 'ภายในวันนี้', date_thai, 'text-warning');
    }
    else {
      this.update('fa fa-calendar-o', date_thai, 'เลยกำหนดเสร็จแล้ว', 'text-danger');
    }
  }
}
