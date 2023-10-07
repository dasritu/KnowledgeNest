const DB = process.env.DATABASE;
const mongoose = require('mongoose');

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Write concern settings
  w: 'majority', // Set the write concern to 'majority' without a semicolon
  wtimeoutMS: 0,
})
  .then(() => {
    console.log('Connection Successful');
  })
  .catch((err) => {
    console.error('Connection Error:', err);
  });
