import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'splitIntoNewLines'})
export class SplitIntoNewLines implements PipeTransform {
  transform(value: string): string {
    if ((typeof value) !== 'string') {
      return value;
    }
    value = value.split(/,/).join('<br />');
    return value;
  }
}
