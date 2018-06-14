exports.setTimeDir = function () {
  var _date = new Date();
  return _date.getFullYear() + '' + (_date.getMonth() < 9 ? '0' : '') + (_date.getMonth() + 1) + '' + _date.getDate();
};
