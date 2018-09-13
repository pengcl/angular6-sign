var mongoose = require('mongoose');
//申明一个mongoons对象
var SignsSchema = new mongoose.Schema({
  uid: String,
  city: String,
  course: String,
  signAt: {
    type: Date,
    default: ''
  }
});

//每次执行都会调用,时间更新操作
SignsSchema.pre('save', function (next) {
  if (this.isNew) {
    this.signAt = Date.now();
  } else {
  }
  next();
});

//查询的静态方法
SignsSchema.statics = {
  findAll: function (cb) { //查询所有数据
    return this.find().sort('meta.updateAt').exec(cb) //回调
  },
  findById: function (id, cb) { //根据id查询单条数据
    return this.findOne({_id: id}).exec(cb)
  },
  findByUid: function (id, cb) { //根据id查询单条数据
    return this.find({uid: id}).exec(cb)
  },
};
//暴露出去的方法
module.exports = SignsSchema;
