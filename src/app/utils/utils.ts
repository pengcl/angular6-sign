import {Md5} from 'md5-typescript';

function objKeySort(obj) {//  排序的函数
  const _key = Object.keys(obj).sort();
  //  先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  const _obj = {}; // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < _key.length; i++) { // 遍历newkey数组
    _obj[_key[i]] = obj[_key[i]]; // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return _obj; // 返回排好序的新对象
}

export function formData(body: object): FormData {
  const _formData: FormData = new FormData();
  for (const kn in body) {
    if (body) {
      _formData.append(kn, body[kn] === undefined ? '' : body[kn]);
    }
  }
  return _formData;
}

export function formDataToUrl(body: object): string {
  let str = '';
  for (const keyName in body) {
    if (!str) {
      str = '?' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    } else {
      str = str + '&' + keyName + '=' + (body[keyName] === undefined ? '' : encodeURI(encodeURI(body[keyName])));
    }
  }
  return str;
}

export function getIndex(arr, key, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i;
    }
  }
}

export function removeByIndex(arr, index) {
  for (let i = 0; i < arr.length; i++) {
    if (i === index) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}

export function signature(params) {
  params['apiSecret'] = 'asdfaisfduiuwerl';
  params = objKeySort(params);
  let str = '';
  for (const key in params) {
    if (key) {
      str = str + key + '=' + params[key] + '&';
    }
  }
  return str.substring(0, str.length - 1);
}

export function canSign(start, end) {
  console.log(start, end);
  start = parseInt(start, 10);
  end = parseInt(end, 10);
  const now = parseInt(Date.parse((new Date()).toString()).toString(), 10);
  return now > start && now < end;
}

