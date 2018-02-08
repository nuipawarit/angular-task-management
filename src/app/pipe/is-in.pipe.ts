import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isIn'
})
export class IsInPipe implements PipeTransform {

  transform(needle: any, array: any[]): boolean {
    if (!Array.isArray(array))
      return false;

    return array.includes(needle);
  }

}
