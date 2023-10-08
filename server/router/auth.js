const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticate = require('../middleware/authentication'); // Corrected import


const nodemailer = require('nodemailer');
const crypto = require('crypto');



const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Example: 'Gmail'
      auth: {
        user: 'rituparnadas67@gmail.com',
        pass: 'zdgu bdmn wszj bhvi',
      },
    });

    const mailOptions = {
      from: 'rituparnadas67@gmail.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};




router.get('/', (req, res) => {
  res.send('Hello world from the server router js');
});

require('../db/conn');
const User = require('../model/userSchema');
const Book = require('../model/bookSchema');
const Quantity=require('../model/qSchema');

router.post('/register', async (req, res) => {
  const { name,email,stream,year,phone,password,cpassword,role}=req.body;

  if(!name||!email||!stream||!year||!phone||!password||!cpassword){
     return res.status(422).json({error:"Pls fill all the field"});
  }
  try{
    const response= await User.findOne({email:email});
    if(response){
     return res.status(422).json({error:"Email already exixts"});
    }
    else if(password != cpassword){
     return res.status(422).json({error:"Password doesnot match"});
    }
    else{
        const lastUser = await User.findOne({ stream,year }).sort({ cardNo: -1 });
        
        let newcode = '001'; // Default if no user exists in the same stream
        if (lastUser) {
          // Increment and pad with leading zeros to a fixed length of 3
          const lastCode = lastUser.cardNo.slice(-3);
          newcode = String(parseInt(lastCode) + 1).padStart(3, '0');
        }

    const cardNo = `${year.charAt(0)}${stream}${newcode}`;
      
      // const cardNo = crypto.randomBytes(4).toString('hex'); // Adjust the length as needed
    const new_user =new User({name,email,stream,year,phone,cardNo,password,cpassword,role});

    const user_reg=await new_user.save();
             if(user_reg){
              const emailText = `Thank you for registering in Student Library Path. Your card number is: ${cardNo}`;
              sendEmail(email, 'Registration Confirmation', emailText);
                 res.status(201).json({ message:"user registered successfully "});
             }
             else{
                 res.status(500).json({error:"Failed"});
             }
         }
     }
 catch(err){
     console.log(err);
 }
});

router.post('/signin', async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the details" }); // Fixed the response format
    }
    const user = await User.findOne({ email: email });
    console.log(user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      token = await user.generateAuthToken();
      console.log(token);
      console.log(user.role);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" }); // Fixed the response format
      } else {
        return res.json({ message: "User Signin Successfully" }); // Fixed the response format
      }
    } else {
      return res.status(400).json({ message: "Invalid Credentials" }); // Fixed the response format
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/about', authenticate, (req, res) => {
  console.log("Hello my Account");
  res.send(req.rootUser);
});

router.get('/logout',(req,res)=>{
    console.log('Hello My Logout Page');
    res.clearCookie('jwtoken',{path:'/'});
    
    res.status(200).send('User Logout');
})


router.post('/addbook', async (req, res) => {
  const { name, author, purchasedate, accessionnumber } = req.body;

  try { 
    console.log('Received request with name:', name);
    let existingBook = await Quantity.findOneAndUpdate(
      { bookName: name },
      { $inc: { quantity: 1 } }, // Increment quantity if book already exists
      { new: true, upsert: true } // Create a new record if it doesn't exist
    );


    const newBook = new Book({ name, author, purchasedate, accessionnumber });
    await newBook.save();
    console.log('Received request with name:', newBook)
    res.json(newBook);
  } catch (error) {
    console.error('Error adding a new book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});



// router.put('/updatebook/:id', async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const updatedData = req.body;

//     const updatedBook = await Book.findByIdAndUpdate(
//       bookId,
//       { $set: updatedData },
//       { new: true }
//     );

//     if (!updatedBook) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     res.json(updatedBook);
//   } catch (error) {
//     console.error('Error updating book:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });






// Assuming you are using Express
router.delete('/deletebook/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Use the appropriate method to find and delete the book by ID
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (deletedBook) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/showbooks", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/showstudent",async(req,res)=>{
  try{
    const students = await User.find();
    res.json(students);
  }
  catch(error){
    res.status(500).json({error:"Internal Server Error"})
  }
})
// Assuming you have something like this in your server code

// Update a book by ID
router.put('/updatebook/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook); // Send the updated book data in the response
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
