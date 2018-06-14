import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'repairDate',
  pure: false
})

@Injectable()
export class RepairDatePipe implements PipeTransform {
  transform(value): any {
    value = value.split('.')[0].replace(/\-/g, '/');
    return value;
  }
}

@Pipe({
  name: 'keys',
  pure: false
})

@Injectable()
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (key) {
        keys.push({key: key, value: value[key]});
      }
    }
    return keys;
  }
}
