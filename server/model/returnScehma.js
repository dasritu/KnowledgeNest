const mongoose=require('mongoose');

const approveScehma=new mongoose.Schema({
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
    accessionNumber:{
        type:String
    },
    returnDate :{
        type:String
    }
    
})


//we are generating token

const returnBook = mongoose.model('return-book',approveScehma);

module.exports =returnBook;