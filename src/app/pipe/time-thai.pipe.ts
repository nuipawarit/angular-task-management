import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeThai'
})
export class TimeThaiPipe implements PipeTransform {
  transform(input: Date): string {
    if (!input) {
      return null;
    }

    if (!(input instanceof Date)) {
      input = new Date((input as string).replace(' ', 'T'));
    }

    const strHour = ('00' + input.getHours().toString()).slice(-2);
    const strMinute = ('00' + input.getMinutes().toString()).slice(-2);
    return strHour + ':' + strMinute + ' น.';
  }

}
