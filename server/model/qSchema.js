// quantitySchema.js
const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
  bookName: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

quantitySchema.index({ bookName: 1, quantity: 1 }, { unique: true });

const Quantity = mongoose.model('qbook', quantitySchema);

module.exports = Quantity;
