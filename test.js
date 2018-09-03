function objKeySort(obj) {//  排序的函数
  const _key = Object.keys(obj).sort();
  //  先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  const _obj = {}; // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < _key.length; i++) { // 遍历newkey数组
    _obj[_key[i]] = obj[_key[i]]; // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return _obj; // 返回排好序的新对象
}

function signature(params) {
  params['apiSecret'] = 'asdfaisfduiuwerl';
  params = objKeySort(params);
  let str = '';
  for (const key in params) {
    str = str + key + '=' + params[key] + '&';
  }
  return str.substring(0, str.length - 1);
}

var str = signature({id: 112, name: 'Pen'});
