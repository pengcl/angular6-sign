var mongoose = require('mongoose');
//申明一个mongoons对象
var UsersSchema = new mongoose.Schema({
  addr: String,
  birthday: Number,
  certificate_type: String,
  city: String,
  country: String,
  create_at: Number,
  email: String,
  employeeno: String,
  en_name: String,
  fav_prod: String,
  head_img: String,
  hobby: String,
  id_no: String,
  is_marry: String,
  kpoint: Number,
  level: String,
  level_id: Number,
  license_plate: String,
  member_id: String,
  nick_name: String,
  person: String,
  phone: String,
  province: String,
  real_name: String,
  reg_at: Number,
  reg_origin: Number,
  requested_source: String,
  sex: String,
  special_card: Array,
  spoint: Number,
  subscribe_list: String,
  union_id: String,
  up_at: Number,
  up_origin: Number,
  vip_code: String,
  zip: String,
  sign: {
    city: String,
    course: String
  }
});

//每次执行都会调用,时间更新操作
UsersSchema.pre('save', function (next) {
  if (this.isNew) {
  } else {
  }
  next();
});

//查询的静态方法
UsersSchema.statics = {
  findAll: function (cb) { //查询所有数据
    return this.find().sort('meta.updateAt').exec(cb) //回调
  },
  findById: function (id, cb) { //根据id查询单条数据
    return this.findOne({_id: id}).exec(cb)
  },
  findByUnionid: function (id, cb) { //根据id查询单条数据
    return this.findOne({union_id: id}).exec(cb)
  },
};
//暴露出去的方法
module.exports = UsersSchema;
