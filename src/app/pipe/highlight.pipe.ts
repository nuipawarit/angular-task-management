import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, phrase: string): any {
    if (typeof text === 'string' && phrase)
      return text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
    else
      return text;
  }

}
