var express = require('express');
var router = express.Router();

var Cities = require('../../utils/db/modules/cities');//导入模型数据模块

router.get('/get', function (req, res, next) {
  if (req.query.id) {
    Cities.findById(req.query.id, (err, city) => {
      if (city) {
        res.send({
          success: true,
          msg: '获取城市成功',
          result: city
        })
      } else {
        res.send({
          success: false,
          msg: '没有',
          result: city
        })
      }
    })
  } else {
    Cities.findAll((err, cities) => {
      res.send({
        success: true,
        msg: '获取城市成功',
        result: cities
      });
    });
  }
});

router.route('/add').post(function (req, res, next) {
  if (req.body.label && req.body.value && req.body.origin) {
    Cities.findByLabel(req.body.label, (err, city) => {
      if (city) {
        res.send({
          success: false,
          msg: '添加的城市已经存在,请重新添加!',
          result: ''
        })
      } else {
        const city = new Cities(req.body);
        city.save((err) => {
          if (err) return false;
          res.send({
            success: true,
            msg: '添加城市成功',
            result: ''
          })
        });
      }
    });
  } else {
    res.send({
      success: false,
      msg: '缺少参数',
      result: ''
    });
  }
});

router.route('/edit').post(function (req, res, next) {
  if (req.body.label && req.body.value && req.body.origin) {
    Cities.findByIdAndUpdate(req.body._id, req.body, (err, city) => {
      res.send({
        success: false,
        msg: '修改成功!',
        result: ''
      })
    });
  } else {
    res.send({
      success: false,
      msg: '缺少参数',
      result: ''
    });
  }
});

module.exports = router;
