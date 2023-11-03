const mongoose=require('mongoose');

const bookSchema=new mongoose.Schema({
    name:{
        type:String,
        
    },
    author:{
        type:String,
        
    },
    purchasedate:{
        type:Date,
        
    },
    accessionnumber: { type: String, unique: true, required: true },
   
    
    
})


//we are generating token

const Book = mongoose.model('books',bookSchema);

module.exports =Book;

//we are hashing the password
