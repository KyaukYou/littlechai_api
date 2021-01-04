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
  locations: {type: [{type: Schema.Types.ObjectId, ref: 'Diary'}],select: false},
  // 所在行业
  business: {type: Schema.Types.ObjectId, ref: 'Diary', select: false},
  // 职业经历
  employments: {
    type: [{
      company: {type: Schema.Types.ObjectId, ref: 'Diary'},
      job: {type: Schema.Types.ObjectId, ref: 'Diary'}
    }],select: false
  },
  // 教育经历
  educations: {
    type: [{
      school: {type: Schema.Types.ObjectId, ref: 'Diary'},
      major: {type: Schema.Types.ObjectId, ref: 'Diary'},
      diploma: {type: Number, enum:[1,2,3,4,5]},
      entrance_year: {type: Number},
      graducation_year: {type: Number}
    }],
    select: false
  },
  // 个人简介
  ownerline: {type: String, select: false},


  //关注用户
  following: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    select: false
  },

  //关注日记
  followingDiary: {
    type: [{type: Schema.Types.ObjectId, ref: 'Diary'}],
    select: false
  },

  //赞过的答案
  likingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },

  //踩过的答案
  dislikingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },

   //收藏的答案
   collectingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  }

},{timestamps: true})

module.exports = model('User',userSchema);

