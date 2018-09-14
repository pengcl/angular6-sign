var express = require('express');
var router = express.Router();

var Users = require('../../utils/db/modules/users');//导入模型数据模块
var Cities = require('../../utils/db/modules/cities');//导入模型数据模块
var Courses = require('../../utils/db/modules/courses');//导入模型数据模块
var Signs = require('../../utils/db/modules/signs');//导入模型数据模块

router.get('/get', function (req, res, next) {
  if (req.query.id) {
    Signs.findById(req.query.id, (err, sign) => {
      if (sign) {

        Users.findById(sign.uid, function (err, user) {
          if (user) {
            Courses.findById(sign.course, function (err, course) {
              if (course) {
                Cities.findById(sign.city, function (err, city) {
                  res.send({
                    success: true,
                    msg: '获取签到数据成功',
                    result: {
                      sign: sign,
                      user: user,
                      city: city,
                      course: course
                    }
                  });
                });
              }
            })
          }
        });
      } else {
        res.send({
          success: false,
          msg: '没有签到数据',
          result: sign
        })
      }
    })
  } else {
    Signs.findAll((err, signs) => {
      var count = 0;
      const _signs = [];
      if (signs.length === 0) {
        res.send({
          success: true,
          msg: '获取签到数据成功',
          result: _signs
        });
      } else {
        signs.forEach((sign) => {
          Users.findById(sign.uid, function (err, user) {
            if (user) {
              Courses.findById(sign.course, function (err, course) {
                if (course) {
                  Cities.findById(sign.city, function (err, city) {
                    count = count + 1;
                    _signs.push({
                      sign: sign,
                      user: user,
                      city: city,
                      course: course
                    });
                    if (count === signs.length) {
                      res.send({
                        success: true,
                        msg: '获取签到数据成功',
                        result: _signs
                      });
                    }
                  });
                }
              })
            }
          });
        });
      }
    });
  }
});

router.route('/remove').post(function (req, res, next) {
  if (req.body.id) {
    Signs.findByIdAndRemove(req.body.id, (err, city) => {
      Signs.findAll((err, signs) => {
        res.send({
          success: true,
          msg: '删除成功',
          result: signs
        });
      });
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
