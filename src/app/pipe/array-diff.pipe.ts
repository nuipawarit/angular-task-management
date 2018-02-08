import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayDiff'
})
export class ArrayDiffPipe implements PipeTransform {
  transform(array1: any[], array2: any[]): any {
    if (!Array.isArray(array1) || !Array.isArray(array2))
      return array1;

    return array1.filter((i) => array2.indexOf(i) < 0);
  }
}
