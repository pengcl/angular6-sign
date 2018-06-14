var express = require('express');
var router = express.Router();
var request = require('request');

var utils = require('../../utils/utils');

/*var mongoose = require('mongoose');
var Users = require('../../utils/db/modules/users');//导入模型数据模块
var Messages = require('../../utils/db/modules/messages');*/

var Config = {
  AppID: '5ad5bc8d88ce7e53f4acee44',
  PublicKey: 'AmrTaT',
  PrivateKey: '9d7ebe7824f2cec1'
};

function pad2(n) {
  return n < 10 ? '0' + n : n
}

function generateTimeReqestNumber() {
  var date = new Date();
  return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}

router.get('/getUserToken', function (req, res, next) {
  const url = "https://openapi10.mallcoo.cn/User/OAuth/v1/GetToken/ByTicket/";
  const timeStamp = generateTimeReqestNumber();
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "AppID": Config.AppID,
    "PublicKey": Config.PublicKey,
    "TimeStamp": timeStamp,
    "Sign": utils.sign({Ticket: req.query.ticket}, timeStamp)
  };

  request({
    url: url,
    method: "POST",
    json: true,
    headers: headers,
    body: {Ticket: req.query.ticket}
  }, function (error, response, body) {
    res.send({
      error: error,
      response: response,
      body: body
    });
  });
});

module.exports = router;
