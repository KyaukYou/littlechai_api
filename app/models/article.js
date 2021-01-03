const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const articleSchema = new Schema({
  __v: {type: Number, select: false},
  title: {type: String, required: true},
  description: {type: String, required: false},
  avatar_url: {type: String, required: false},
  articler: {type: Schema.Types.ObjectId, ref: 'User', select: false, required: true},
  diary: {type: [{type: Schema.Types.ObjectId, ref: 'Article'}],select: false}
})

module.exports = model('Article',articleSchema);

