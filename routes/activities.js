var express = require('express');
var router = express.Router();
var request = require('request');

var utils = require('../utils/utils');
var Votes = require('../utils/db/modules/votes');

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

router.get('/getActivities', function (req, res, next) {
  const url = "https://openapi10.mallcoo.cn/Event/Activity/V1/GetList/";
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
    body: {}
  }, function (error, response, body) {
    res.send(body);
  });
});

router.route('/plus').post(function (req, res, next) {
  req.body.Reason = encodeURI(req.body.Reason);
  console.log(req.body);
  const url = "https://openapi10.mallcoo.cn/User/Score/v1/Plus/ByOpenUserID/";
  const timeStamp = generateTimeReqestNumber();
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "AppID": Config.AppID,
    "PublicKey": Config.PublicKey,
    "TimeStamp": timeStamp,
    "Sign": utils.sign(req.body, timeStamp)
  };

  request({
    url: url,
    method: "POST",
    json: true,
    headers: headers,
    body: req.body
  }, function (error, response, body) {
    if (body.Code === 1) {
      Votes.findByOwner(req.body.OpenUserId).then(vote => {
        vote.score = vote.score + req.body.Score;
        vote.save();
      })
    }
    res.send(body);
  });

});

module.exports = router;
