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

@Pipe({
  name: 'label',
  pure: false
})

@Injectable()
export class LabelPipe implements PipeTransform {
  transform(value, arr): any {
    if (!value) {
      return '不限';
    }

    let label = '';

    arr.forEach(item => {
      if (value === item.value) {
        label = item.label;
      }
    });

    return label;
  }
}
