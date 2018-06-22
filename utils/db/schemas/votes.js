var mongoose = require('mongoose');
//申明一个mongoons对象
var VotesSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  owner: String,
  avatar: String,
  nickName: String,
  content: String,
  score: Number,
  vote: {
    A: String,
    B: String,
    C: String,
    D: String,
    E: String,
    F: String,
    G: String,
    H: String
  },
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
VotesSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
    this.score = 0;
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

//查询的静态方法
VotesSchema.statics = {
  findAll: function (cb) { //查询所有数据
    return this.find().sort('meta.updateAt').exec(cb) //回调
  },
  findById: function (id, cb) { //根据id查询单条数据
    return this.findOne({_id: id}).exec(cb)
  },
  findByOwner: function (id, cb) { //根据id查询单条数据
    return this.findOne({owner: id}).exec(cb)
  },
};
//暴露出去的方法
module.exports = VotesSchema;
