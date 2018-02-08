import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'objToArray'
})
export class ObjToArrayPipe implements PipeTransform {
  transform(collection: any): any {
    return Array.isArray(collection) ? collection : Object.keys(collection).map((key) => collection[key]);
  }

}
