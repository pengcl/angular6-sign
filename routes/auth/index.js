var express = require('express');
var router = express.Router();

router.route('/signIn').post(function (req, res, next) {
  if (req.body.username && req.body.password) {
    const username = req.body.username;
    const password = req.body.password;
    if (username !== 'admin') {//用户不存在
      res.send({
        success: false,
        msg: '登录用户不存在,请重新登录!',
        result: ''
      });
    } else {//如果数据库存在此mobile的用户
      if (password === 'k1234567890') {
        res.send({
          success: true,
          msg: '欢迎您的登录，期待您能创造价值！',
          result: {
            id: 'admin',
            admin: true
          }
        });
      } else {
        res.send({
          success: false,
          msg: '登录失败，用户名或密码不正确！',
          result: ''
        });
      }
    }
  } else {
    res.send({
      success: false,
      msg: '缺少参数',
      result: ''
    });
  }
});

module.exports = router;
