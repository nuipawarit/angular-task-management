import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFormat'
})
export class MomentFormatPipe implements PipeTransform {

  transform(input: any, format: string): string {
    const isValidString = function (obj) {
      return (moment(obj, 'YYYY-MM-DD', true).isValid() ||
          moment(obj, 'YYYY-MM-DD HH:mm:ss.SSSS', true).isValid());
    };

    if (!input) {
      return input;
    }
    else if (moment(input).isValid()) {
      return moment(input).format(format);
    }
    else {
      return input;
    }
  }

}
