var mongoose = require('mongoose');
//申明一个mongoons对象
var CountriesSchema = new mongoose.Schema({
  country: String,
  group: String,
  votes: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    },
    publicAt: {
      type: Date,
      default: ''
    }
  }
});

//每次执行都会调用,时间更新操作
CountriesSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
    this.votes = 0;
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

//查询的静态方法
CountriesSchema.statics = {
  findAll: function (cb) { //查询所有数据
    return this.find().sort('meta.updateAt').exec(cb) //回调
  },
  findById: function (id, cb) { //根据id查询单条数据
    return this.findOne({_id: id}).exec(cb)
  },
  findByType: function (typeId, cb) {
    return this.find({
      'type.id': typeId
    }).sort('meta.publicAt').exec(cb) //回调
  }
};
//暴露出去的方法
module.exports = CountriesSchema;
