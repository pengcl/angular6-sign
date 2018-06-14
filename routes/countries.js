var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Countries = require('../utils/db/modules/countries');//导入模型数据模块

/*router.get('/init', function (req, res, next) {
  _countries.forEach((item, i) => {
    const country = new Countries(item);
    country.save((err, country) => {
      if (err) return err;

      if (i === _countries.length - 1) {
        res.send('初始化成功');
      }
    });
  });
});*/

router.get('/find', function (req, res, next) {
  Countries.findAll().then(data => {
    res.send(data);
  })
});

module.exports = router;
