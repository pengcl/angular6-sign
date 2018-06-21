var express = require('express');
var router = express.Router();
let {WxSvc} = require('../../utils/service/wx.js');


/* GET home page. */
router.get('/', function (req, res, next) {

  WxSvc.getTicket().then(function (data) {
    var wxConfig = WxSvc.sign(data.ticket, req.query.url);
    res.send(wxConfig);
  });
});

module.exports = router;
