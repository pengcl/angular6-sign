var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/*var utils = require('./utils/utils');
var wxApi = require('./routes/wxApi');*/

var auth = require('./routes/auth');
var city = require('./routes/city');
var course = require('./routes/course');
var klub = require('./routes/klub/klub');
var wxConfig = require('./routes/wx/config');

var app = express();

mongoose.connect('mongodb://sign:Pengcl19821025@101.200.72.54:27017/sign', {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials/');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/*app.use(utils.sign());
app.use('/wxApi', wxApi);*/
//微信签名认证
/*app.use(utils.sign(config));*/

app.use('/auth', auth);
app.use('/city', city);
app.use('/course', course);
app.use('/wx/config', wxConfig);
app.use('/klub', klub);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//sudo ng serve --proxy api.json --port 80
