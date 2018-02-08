import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName'
})
export class FirstNamePipe implements PipeTransform {

  transform(text: any): any {
    return (typeof text === 'string') ? text.split(' ')[0] : text;
  }

}
