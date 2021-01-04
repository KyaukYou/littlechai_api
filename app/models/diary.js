const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const diarySchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  avatar_url: {type: String, required: false},
  introduction: {type: String, select: false, required: false}
},{timestamps: true})

module.exports = model('Diary',diarySchema);

