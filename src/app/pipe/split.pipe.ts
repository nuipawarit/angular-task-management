import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(input: string, separator: string = ' ', limit?: number): any {
    return typeof input !== 'string' ? input : input.split(separator, limit);
  }

}
