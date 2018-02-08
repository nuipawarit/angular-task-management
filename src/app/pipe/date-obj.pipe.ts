import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateObj'
})
export class DateObjPipe implements PipeTransform {
  transform(input: string): Date {
    return input && input !== '1900-01-01 00:00:00.000' ? new Date(input.replace(' ', 'T')) : null;
  }

}
