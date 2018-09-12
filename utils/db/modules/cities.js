var mongoose = require('mongoose');
var CitiesSchema = require('../schemas/cities'); //拿到导出的数据集模块
var Cities = mongoose.model('Cities', CitiesSchema); // 编译生成Users 模型

module.exports = Cities;
