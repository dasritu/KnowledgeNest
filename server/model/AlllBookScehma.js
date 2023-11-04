const mongoose=require('mongoose');
const approvalSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    approvalDate: {
        type: Date,
        default: Date.now,
    },
});
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
   
    approvals: [approvalSchema], 
    
})


//we are generating token

const AllBook = mongoose.model('allbooks',bookSchema);

module.exports =AllBook;