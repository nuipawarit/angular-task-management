import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateThai'
})
export class DateThaiPipe implements PipeTransform {
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
    return strDay + ' ' + strMonthThai + ' ' + strYear;
  }

}
