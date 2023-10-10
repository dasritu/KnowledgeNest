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
        typr:String
    }
    
})


//we are generating token

const approveBook = mongoose.model('approvetbook',approveScehma);

module.exports =approveBook;