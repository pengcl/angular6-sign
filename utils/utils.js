var utils = {};
var crypto = require('crypto');

function MD5EncryptTo16(EncryptString) {
  if (!EncryptString) {
    console.log("密文不得为空");
  }
  var md5 = crypto.createHash("md5");
  md5.update(EncryptString);
  var str = md5.digest('hex');
  return str.substring(8, 8 + 16);
}

utils.sign = function (body, timeStamp) {
  var PublicKey = "AmrTaT";
  //私钥
  var privateKey = "9d7ebe7824f2cec1";
  //时间戳
  var timeStamp = timeStamp;
  //签名字符串
  var sign = "";
  //加密时需要把对象转换为json字符串(data：带传入的DTO对象数据)
  var jsonData = JSON.stringify(body);

  //待加密字符串（顺序必须一致，大小写必须相同）
  var encryptString = "{publicKey:" + PublicKey + ",timeStamp:" + timeStamp + ",data:" + jsonData + ",privateKey:" + privateKey + "}";
  console.log(encryptString);
  //生成[签名字符串](使用MD516位加密)
  sign = MD5EncryptTo16(encryptString).toUpperCase();
  return sign;
};

utils.setTimePath = function () {
  var _date = new Date();
  return _date.getFullYear() + '' + (_date.getMonth() + 1) + '' + _date.getDate();
};

module.exports = utils;
