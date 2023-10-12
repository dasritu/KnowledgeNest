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
    accessionnumber:{
        type:String,
        
    },
   
    
    
})


//we are generating token

const AllBook = mongoose.model('allbooks',bookSchema);

module.exports =AllBook;