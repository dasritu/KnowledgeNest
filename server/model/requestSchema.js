const mongoose=require('mongoose');

const requestSchema=new mongoose.Schema({
    studentName:{
        type:String,
        
    },
    cardNumber:{
        type:String,
        
    },
    stream:{
        type:String,
    },
    bookName:{
        type:String,
        
    },
   bookAuthor:{
    type:String,
   },
   accessionnumber:{
      type:String,
   },
   requestDateTime: {
    type: String,
   
  },
    
})


//we are generating token

const RequestBook = mongoose.model('requestbook',requestSchema);

module.exports =RequestBook;