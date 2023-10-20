const dotenv=require("dotenv");
const express=require('express');
// const cors=require('cors');
const cookieParser = require('cookie-parser');
const app=express();
app.use(cookieParser());
dotenv.config({path:'./config.env'});
require('./db/conn');

app.use(express.json());
// app.use(middleware);
app.use(require('./router/auth'));

app.get('/',(req,res)=>{
    res.send('Hello world from the server from app.js');
});

//MIddleware
// app.use(cors({
//     origin:"http://localhost:3000",
// }));
const middleware=(req,res,next)=>{
    console.log("hello my Middleware");
    next();
}
// app.get('/about',middleware,(req,res)=>{
//     console.log("Hello my Account");
//     res.send('Hello about');
// });
app.get('/contact',(req,res)=>{
    res.send('Hello contact');
});
app.get('/signup',(req,res)=>{
    res.send('Hello signup');
});
app.get('/signin',(req,res)=>{
    res.send('Hello world signin');
});

app.listen(8000,()=>{
    console.log("Server started at port 8000")
})