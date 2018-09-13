var express = require('express');
var router = express.Router();

var Courses = require('../../utils/db/modules/courses');//导入模型数据模块

router.get('/get', function (req, res, next) {
  if (req.query.id) {
    Courses.findById(req.query.id, (err, course) => {
      if (course) {
        res.send({
          success: true,
          msg: '获取课程成功',
          result: course
        })
      } else {
        res.send({
          success: false,
          msg: '没有',
          result: course
        })
      }
    })
  } else {
    Courses.findAll((err, courses) => {
      res.send({
        success: true,
        msg: '获取课程成功',
        result: courses
      });
    });
  }
});

router.route('/add').post(function (req, res, next) {
  if (req.body.label && req.body.cities && req.body.start && req.body.end) {
    req.body.cities = req.body.cities.split(',');
    Courses.findByLabel(req.body.label, (err, course) => {
      if (course) {
        res.send({
          success: false,
          msg: '添加的课程已经存在,请重新添加!',
          result: ''
        })
      } else {
        const course = new Courses(req.body);
        course.save((err) => {
          if (err) return false;
          res.send({
            success: true,
            msg: '添加课程成功',
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
  if (req.body.label && req.body.cities && req.body.start && req.body.end) {
    req.body.cities = req.body.cities.split(',');
    console.log(req.body);
    Courses.findByIdAndUpdate(req.body._id, req.body, (err, course) => {
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

router.route('/remove').post(function (req, res, next) {
  if (req.body.id) {
    Courses.findByIdAndRemove(req.body.id, (err, course) => {
      Courses.findAll((err, courses) => {
        res.send({
          success: true,
          msg: '删除成功',
          result: courses
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
