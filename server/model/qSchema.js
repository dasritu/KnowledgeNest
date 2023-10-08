// quantitySchema.js
const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
  bookAuthor: {
    type: String,
  },
  bookName: {
    type: String,
    unique: false, // Set to false to allow multiple records with the same bookName
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

quantitySchema.index({ bookName: 1, bookAuthor: 1 }, { unique: false });

const Quantity = mongoose.model('qbook', quantitySchema);

module.exports = Quantity;

