import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateTimeThai'
})
export class DateTimeThaiPipe implements PipeTransform {
  transform(input: Date): string {
    if (!input) {
      return null;
    }

    if (!(input instanceof Date)) {
      input = new Date((input as string).replace(' ', 'T'));
    }

    const month_list = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const strDay = input.getDate();
    const strMonthThai = month_list[input.getMonth()];
    const strYear = input.getFullYear();
    const dateThai = strDay + ' ' + strMonthThai + ' ' + strYear;

    const strHour = ('00' + input.getHours().toString()).slice(-2);
    const strMinute = ('00' + input.getMinutes().toString()).slice(-2);
    const timeThai = strHour + ':' + strMinute + ' น.';

    return dateThai + '  ' + timeThai;
  }

}
