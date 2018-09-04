var express = require('express');
var router = express.Router();
var request = require('request');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var crypto = require('crypto');

var Users = require('../../utils/db/modules/users');//导入模型数据模块

var Config = {
  apiKey: '993153596383692',
  apiSecret: '9v6BY56P',
  interfaceId: '39ed93e7030a1fea3ac5',
  skey: '06a2d990',
  account_id: 14
};

function decode(str) {
  str = str.replace(/mqtp/gi, ':');
  str = str.replace(/mbscd/gi, '=');
  str = str.replace(/nnddt/gi, '+');
  str = str.replace(/abcde/gi, '/');
  str = str.replace(/adted/gi, '|');
  let strLen = str.length;

  var arr = [];
  var s = '';
  var i = 0;
  while (true) {
    if (strLen == 0) {
      break;
    } else if (strLen == 1) {
      s = str.substring(0);
      str = str.substring(1);
    } else {
      s = str.substring(0, 2);
      str = str.substring(2);
    }
    arr[i] = s;
    i++;
    strLen = str.length;
  }

  var strCount = arr.length;
  var list = Config.skey.split('');
  for (var i = 0; i < list.length; i++) {
    if (i <= strCount && arr[i].substring(1, 2) === list[i]) {
      arr[i] = arr[i].substring(0, 1);
    }
  }

  var sb = '';
  arr.forEach(item => {
    sb = sb + item;
  });
  sb = new Buffer(sb, 'base64');
  sb = sb.toString('hex');
  sb = new Buffer(sb, 'hex');
  sb = sb.toString('utf8');
  return sb;
}

function formDataToUrl(body) {
  let str = '';
  for (const keyName in body) {
    if (!str) {
      str = '?' + keyName + '=' + (body[keyName] === undefined ? '' : body[keyName]);
    } else {
      str = str + '&' + keyName + '=' + (body[keyName] === undefined ? '' : body[keyName]);
    }
  }
  return str;
}

function objKeySort(obj) {//  排序的函数
  const _key = Object.keys(obj).sort();
  //  先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  const _obj = {}; // 创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < _key.length; i++) { // 遍历newkey数组
    _obj[_key[i]] = obj[_key[i]]; // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return _obj; // 返回排好序的新对象
}

/*var mongoose = require('mongoose');
var Users = require('../../utils/db/modules/users');//导入模型数据模块
var Messages = require('../../utils/db/modules/messages');*/

function signature(params) {
  params['apiSecret'] = Config.apiSecret;
  params = objKeySort(params);
  var str = '';
  for (const key in params) {
    if (key) {
      str = str + key + '+' + params[key];
    }
  }

  var md5 = crypto.createHash("md5");
  md5.update(str);
  return md5.digest('hex').toLowerCase();
}

router.get('/config', function (req, res, next) {
  var params = {};
  params['timestamp'] = Date.parse(new Date().toString()) / 1000;
  params['interfaceId'] = Config.interfaceId;
  params['apiKey'] = Config.apiKey;
  params['account_id'] = Config.account_id;
  params['debug'] = 1;
  params['domain_url'] = req.query.domain_url;
  params['sign'] = signature(params);
  params = formDataToUrl(params);
  const url = "http://api.klub11.com/v1/wechat-js/js-config" + params;

  request({
    url: url,
    method: "GET"
  }, function (error, response, body) {
    const data = decode(body);
    res.send(data);
  });
});

router.get('/auth', function (req, res, next) {
  var params = {};
  params['timestamp'] = Date.parse(new Date().toString()) / 1000;
  params['interfaceId'] = Config.interfaceId;
  params['apiKey'] = Config.apiKey;
  params['account_id'] = Config.account_id;
  params['scope'] = 'user';
  params['redirect_uri'] = req.query.redirect_uri;
  params['h_app_id'] = Config.apiKey;
  params['sign'] = signature(params);
  params['redirect_uri'] = encodeURIComponent(req.query.redirect_uri);
  params = formDataToUrl(params);
  const url = "http://api.klub11.com/v1/oauth2/authorize-base" + params;
  console.log(url);

  res.location(url);
  res.statusCode = 301;
  res.end('');

  /*console.log('.............url............');
  console.log(url);
  request({
    url: url,
    method: "GET"
  }, function (error, response, body) {
    console.log(body);
    const data = decode(body);
    res.send(data);
  });*/
});

router.get('/user', function (req, res, next) {
  var params = {};
  params['timestamp'] = Date.parse(new Date().toString()) / 1000;
  params['interfaceId'] = Config.interfaceId;
  params['apiKey'] = Config.apiKey;

  if (req.query.union_id) {
    params['union_id'] = req.query.union_id;
  }
  if (req.query.mobile) {
    params['mobile'] = req.query.mobile;
  }
  params['sign'] = signature(params);
  params = formDataToUrl(params);

  let url = "";

  if (req.query.union_id) {
    url = "http://api.klub11.com/v1/external/getunionidinfo" + params;
  }
  if (req.query.mobile) {
    url = "http://api.klub11.com/v1/external/getmemberinfo" + params;
  }

  console.log(url);

  request({
    url: url,
    method: "GET"
  }, function (error, response, body) {
    const data = decode(body);
    let result;
    if (res.data[0]) {
      result = {
        code: 0,
        msg: '获取会员信息成功',
        data: data.data[0]
      }
    } else {
      result = {
        code: 9999,
        msg: '用户不存在',
        data: 'https://app.klub11.com/?r=page/auth&account_id=' + Config.account_id + '&origin=7&_redirecturl=xxxxxxx'
      }
    }
    res.send(data);
  });
});

router.route('/getCourses').post(multipartMiddleware, function (req, res, next) {
  var params = req.body;
  params['timestamp'] = Date.parse(new Date().toString()) / 1000;
  params['interfaceId'] = Config.interfaceId;
  params['apiKey'] = Config.apiKey;
  params['sign'] = signature(params);
  params = formDataToUrl(params);
  const url = "http://api.klub11.com/v1/goods/getrecordinfo" + params;

  console.log(url);

  request({
    url: url,
    method: "GET"
  }, function (error, response, body) {
    const data = decode(body);
    res.send(data);
  });
});

router.route('/sign').post(multipartMiddleware, function (req, res, next) {
  var params = {};
  for (const key in req.body) {
    if (key !== '_redirecturl' && key !== 's_name' && key !== 'goods_name') {
      params[key] = req.body[key];
    }
  }
  params['timestamp'] = Date.parse(new Date().toString()) / 1000;
  params['interfaceId'] = Config.interfaceId;
  params['apiKey'] = Config.apiKey;
  params['sign'] = signature(params);
  params = formDataToUrl(params);
  const url = "http://api.klub11.com/v1/external/getunionidinfo" + params;

  request({
    url: url,
    method: "GET"
  }, function (error, response, body) {
    const data = JSON.parse(decode(body));
    let result;
    if (data.code === 0) {
      if (data.data[0]) {
        Users.findByUnionid(req.body.union_id, (err, user) => {
          if (user) {
            console.log('.....您已经签过到了......');
            res.send({
              code: 0,
              msg: '您已经签过到了',
              data: data.data[0]
            });
          } else {
            console.log('.....用户不存在......');
            const _user = data.data[0];
            _user['sign'] = {
              sid: req.body.sid,
              s_name: req.body.s_name,
              goods_id: req.body.goods_id,
              goods_name: req.body.goods_name
            };
            var user = new Users(_user);
            user.save((err) => {
              if (!err) {
                res.send({
                  code: 0,
                  msg: '签到成功！',
                  data: data.data[0]
                })
              }
            });
          }
        });
      } else {
        console.log('.....用户没注册过，跳转注册......');
        res.send({
          code: 9999,
          msg: '用户不存在',
          data: 'http://onecard.klub11.com/pass/mobile/entry?&account_id=' + Config.account_id + '&origin=' + req.body.origin + '&_redirecturl=' + encodeURIComponent(req.body._redirecturl)
        });
      }
    } else {
      res.send(data)
    }
  });
});

module.exports = router;

/*db.auth("sign", "Pengcl19821025")
db.createUser({user: "sign", pwd: "Pengcl19821025", roles: [{role: "dbOwner", db: "sign"}]})*/
