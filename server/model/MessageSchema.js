// quantitySchema.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
   
  },
  message: {
    type: String,
 
  },
});



const MessageSchema = mongoose.model('message', messageSchema);

module.exports = MessageSchema
