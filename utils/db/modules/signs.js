var mongoose = require('mongoose');
var SignsSchema = require('../schemas/signs'); //拿到导出的数据集模块
var Signs = mongoose.model('Signs', SignsSchema); // 编译生成Users 模型

module.exports = Signs;
