const mongoose=require('mongoose');
const quantitySchema = new mongoose.Schema({
    bookName: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0, // Initial quantity is 0
    },
  });

  const Quantity = mongoose.model('quantity',quantitySchema);

  module.exports =Quantity;