// quantitySchema.js
const mongoose = require('mongoose');

const quantstudent = new mongoose.Schema({
 stream:{
    type:String
 }
,
  quantity: {
    type: Number,
    default: 0,
  },
});

const Quantity = mongoose.model('qstudent', quantstudent);

module.exports = Quantity;