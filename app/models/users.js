const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const userSchema = new Schema({
  __v: {type: Number, select: false},
  // 姓名
  name: {type: String, required: true},
  // 密码
  password: {type: String, required: true, select: false},
  // 头像
  avatar_url: {type: String},
  // 背景
  background_url: {type: String},
  // 性别
  gender: {type: String, enum: ['male','female'], default: 'male', required: true},
  // 一句话简介
  headline: {type: String},
  // 居住地
  locations: {type: [{type: String}],select: false},
  // 所在行业
  business: {type: String, select: false},
  // 职业经历
  employments: {
    type: [{
      company: {type: String},
      job: {type: String}
    }],select: false
  },
  // 教育经历
  educations: {
    type: [{
      school: {type: String},
      major: {type: String},
      diploma: {type: Number, enum:[1,2,3,4,5]},
      entrance_year: {type: Number},
      graducation_year: {type: Number}
    }],
    select: false
  },
  // 个人简介
  ownerline: {type: String, select: false}
})

module.exports = model('User',userSchema);

