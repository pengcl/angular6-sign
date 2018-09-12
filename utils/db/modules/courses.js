var mongoose = require('mongoose');
var CoursesSchema = require('../schemas/courses'); //拿到导出的数据集模块
var Courses = mongoose.model('Courses', CoursesSchema); // 编译生成Users 模型

module.exports = Courses;
