var mongoose = require('mongoose');
var VotesSchema = require('../schemas/votes'); //拿到导出的数据集模块
var Votes = mongoose.model('Votes', VotesSchema); // 编译生成Users 模型

module.exports = Votes;
