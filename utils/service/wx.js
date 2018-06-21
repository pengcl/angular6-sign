var request = require('request');
var fs = require('fs');
var Q = require('q');
var jsSHA = require('jssha');
var sha1 = require('sha1');
var config = require('../../config/config');
var WxSvc = {};

WxSvc.getAccessToken = function () { //获取基础access_token;
  var deferred = Q.defer();
  var now = Date.parse(new Date());
  fs.readFile('../data/accessToken.json', 'utf-8', function (err, data) {
    var data = JSON.parse(data);
    console.log(data.expires_time - now);
    if (!err && data.expires_time && data.expires_time >= now) {//如果accessToken.json文件存在，并且没有过期
      console.log('..........1............');
      console.log('...........accessToken.json文件存在，并且没有过期...........');
      deferred.resolve(data);
    } else {//如果accessToken.json不存在，或者已过期
      console.log('..........2............');
      console.log('...........accessToken.json不存在，或者已过期...........');
      request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.duty.appID + '&secret=' + config.duty.appSecret, function (error, response, body) {
        if (!error && response.statusCode == 200) {//请求成功
          body = JSON.parse(body);
          if (body.access_token) {
            body.expires_time = now + 1800000;//添加过期时间
            fs.writeFile('../data/accessToken.json', JSON.stringify(body), {
              flag: 'w',
              encoding: 'utf-8',
              mode: '0666'
            }, function (err) {
              if (!err) {
                console.log("文件写入成功");
              } else {
                console.log(err)
              }
              deferred.resolve(body);
            });
          } else {
            console.log(body);
            deferred.reject(new Error(body));
          }
        } else {
          deferred.reject(new Error(error));
        }
      });
    }
  });
  return deferred.promise;
};

WxSvc.getTicket = function () { //获取ticket
  var deferred = Q.defer();
  var now = Date.parse(new Date());
  fs.readFile('../data/ticket.json', 'utf-8', function (err, data) {
    var data = JSON.parse(data);
    if (!err && data.expires_time && data.expires_time >= now) {//如果ticket.json文件存在，并且没有过期
      deferred.resolve(data);
    } else {//如果ticket.json不存在，或者已过期
      WxSvc.getAccessToken().then(function (data) {
        request('http://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' + data.access_token, function (error, response, body) {
          if (!error && response.statusCode == 200) {//请求成功
            body = JSON.parse(body);
            if (body.ticket) {
              body.expires_time = now + 7000000;//添加过期时间
              fs.writeFile('../data/ticket.json', JSON.stringify(body), {
                flag: 'w',
                encoding: 'utf-8',
                mode: '0666'
              }, function (err) {
                if (!err) {
                  console.log("文件写入成功");
                } else {
                  console.log(err)
                }
                deferred.resolve(body);
              });
            } else {
              console.log(body);
              deferred.reject(new Error(body));
            }
          } else {
            deferred.reject(new Error(error));
          }
        });
      });
    }
  });
  return deferred.promise;
};

WxSvc.OAuth = {};

WxSvc.OAuth.getCode = function (redirect_uri) { //获取code,code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
  return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.duty.appID + "&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
};

WxSvc.OAuth.getAccessToken = function (code) { //通过code换取网页授权access_token
  var deferred = Q.defer();
  request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.duty.appID + '&secret=' + config.duty.appSecret + '&code=' + code + '&grant_type=authorization_code', function (error, response, body) {
    if (!error && response.statusCode == 200) {//请求成功
      body = JSON.parse(body);
      deferred.resolve(body);
    } else {
      deferred.reject(new Error(error));
    }
  });
  return deferred.promise;
};

WxSvc.getUserInfo = function (access_token, openid) { //通过基础access_token和openid拉取用户信息了。
  var deferred = Q.defer();
  request('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN', function (error, response, body) {
    if (!error && response.statusCode == 200) {//请求成功
      body = JSON.parse(body);
      deferred.resolve(body);
    } else {
      deferred.reject(new Error(error));
    }
  });
  return deferred.promise;
};

var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }

  string = string.substr(1);

  return string;
};

/**
 * @synopsis 签名算法
 *
 * @param ticket 用于签名的 ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
WxSvc.sign = function (ticket, url) {//生成签名

  var data = {
    jsapi_ticket: ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };
  var string = raw(data);
  data.signature = sha1(string);

  data.appId = config.duty.appID;

  console.log(data);
  return data;
};

/*module.exports = sign;*/


exports.WxSvc = WxSvc;
