const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticate = require('../middleware/authentication');


const nodemailer = require('nodemailer');
const crypto = require('crypto');


//mail sending function
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'knowledgenestsr23@gmail.com',
        pass: 'fzfa ybwg uouj qeyo',
      },
    });

    const mailOptions = {
      from: 'knowledgenestsr23@gmail.com',
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
const Quantity = require('../model/qSchema');
const Request = require('../model/requestSchema');
const ApproveBook = require('../model/approve-bookSchema')
const Return = require('../model/returnScehma');
const AllBook = require('../model/AlllBookScehma');
const QuantityStudent = require('../model/qstudent')
const Message = require('../model/MessageSchema')

//register router

router.post('/register', async (req, res) => {
  const { name, email, stream, year, phone, password, cpassword, role } = req.body;

  if (!name || !email || !stream || !year || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Pls fill all the field" });
  }
  try {
    const response = await User.findOne({ email: email });
    if (response) {
      return res.status(422).json({ error: "Email already exixts" });
    }
    else if (password != cpassword) {
      return res.status(422).json({ error: "Password doesnot match" });
    }
    else {
      const currentYear = new Date().getFullYear();
      const lastDigitOfYear = currentYear.toString().slice(-2);
      const lastUser = await User.findOne({ stream, year }).sort({ cardNo: -1 });

      let newcode = '001'; 
      if (lastUser) {
        const lastCode = lastUser.cardNo.slice(-3);
        newcode = String(parseInt(lastCode) + 1).padStart(3, '0');
      }

      const cardNo = `${lastDigitOfYear}${year.charAt(0)}${stream}${newcode}`;

      const new_user = new User({ name, email, stream, year, phone, cardNo, password, cpassword, role });

      const user_reg = await new_user.save();

      const existstream = await QuantityStudent.findOne({ stream })
      if (!existstream) {
        const newQuantity = new QuantityStudent({ stream, quantity: 1 })
        await newQuantity.save()
      }
      else {
        existstream.quantity += 1;
        await existstream.save();
      }
      if (user_reg) {
        const emailText = `Thank you for registering in Student Library Path. Your card number is: ${cardNo}`;
        sendEmail(email, 'Registration Confirmation', emailText);
        res.status(201).json({ message: "user registered successfully " });
      }
      else {
        res.status(500).json({ error: "Failed" });
      }
    }
  }
  catch (err) {
    console.log(err);
  }
});
//login Route
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
        return res.status(400).json({ message: "Invalid Credentials" }); 
      } else {
        return res.json({ message: "User Signin Successfully" }); 
      }
    } else {
      return res.status(400).json({ message: "Invalid Credentials" }); 
    }
  } catch (err) {
    console.log(err);
  }
});
//aboute page route middleware 
router.get('/about', authenticate, (req, res) => {
  console.log("Hello my Account");
  res.send(req.rootUser);
});
//logout Route
router.get('/logout', (req, res) => {
  console.log('Hello My Logout Page');
  res.clearCookie('jwtoken', { path: '/' });

  res.status(200).send('User Logout');
})

//Add Book Route
router.post('/addbook', async (req, res) => {
  const { name, author, purchasedate, accessionnumber } = req.body;

  try {
    console.log('Received request with name and author:', name, author);

    const isAccessionNumberTaken = await AllBook.exists({ accessionnumber });

    if (isAccessionNumberTaken) {
      return res.status(400).json({ error: 'Accession number is already in use.' });
    }

   
    const existingBook = await Quantity.findOne({ bookAuthor: author, bookName: name });

    if (!existingBook) {
      const newQuantity = new Quantity({ bookAuthor: author, bookName: name, quantity: 1 });
      await newQuantity.save();
    } else {
      existingBook.quantity += 1;
      await existingBook.save();
    }

   
    const newBook = new Book({ name, author, purchasedate, accessionnumber });
    await newBook.save();

   
    const allNewBook = new AllBook({ name, author, purchasedate, accessionnumber });
    await allNewBook.save();

    console.log('Added a new book:', newBook);
    res.json(newBook);
  } catch (error) {
    console.error('Error adding/updating a book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete Book Route
router.delete('/deletebook/:id', async (req, res) => {
  const bookId = req.params.id;

  try {

    const deletedBook = await Book.findByIdAndDelete(bookId);


    const updatedQuantity = await Quantity.findOneAndUpdate(
      { bookName: deletedBook.name, bookAuthor: deletedBook.author },
      { $inc: { quantity: -1 } },
      { new: true }
    );


    if (updatedQuantity && updatedQuantity.quantity <= 0) {

      await Quantity.findOneAndDelete({ bookName: deletedBook.name, bookAuthor: deletedBook.author });
    }

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

//Show Book Route
router.get("/showbooks", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/showstudent", async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

//Shows The Quantity OF Stuednts

router.get("/showquantitystudent", async (req, res) => {
  try {
    const quantity = await QuantityStudent.find();
    res.json(quantity)
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

//Update Students

router.put('/updatestudent/:id', async (req, res) => {
  try {
    const stdid = req.params.id;

    const { name, email, stream, year, phone } = req.body;

    const updateStudent = await User.findByIdAndUpdate(
      stdid,
      { name, email, stream, year, phone },
      { new: true }
    );

    res.json(updateStudent);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Books

router.put('/updatebook/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const prevBook = await Book.findById(bookId);
    const books = await AllBook.findOne({ accessionnumber: prevBook.accessionnumber });
    const booksId = books._id;
  
    if (
      (req.body.author && req.body.author !== prevBook.author) ||
      (req.body.name && req.body.name !== prevBook.name)
    ) {
      
      const prevQuantity = await Quantity.findOneAndUpdate(
        { bookAuthor: prevBook.author, bookName: prevBook.name },
        { $inc: { quantity: -1 } },
        { new: true }
      );

     
      if (prevQuantity && prevQuantity.quantity <= 0) {
        await Quantity.findOneAndDelete({
          bookAuthor: prevBook.author,
          bookName: prevBook.name,
        });
      }

      
      const newQuantity = await Quantity.findOneAndUpdate(
        { bookAuthor: req.body.author, bookName: req.body.name },
        { $inc: { quantity: 1 } },
        { upsert: true, new: true }
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
    const updateAllBook = await AllBook.findByIdAndUpdate(booksId, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Request Book Route

router.post("/request-book", async (req, res) => {
  const { studentName, cardNumber, stream, bookName, bookAuthor, accessionnumber, requestDateTime } = req.body;
  try {

    const newRequest = new Request({ studentName, cardNumber, stream, bookName, bookAuthor, accessionnumber, requestDateTime });
    await newRequest.save();
    res.json(newRequest);

    const book = await Book.findOneAndDelete({ accessionnumber });
    const prevQuantity = await Quantity.findOneAndUpdate(
      { bookAuthor: newRequest.bookAuthor, bookName: newRequest.bookName },
      { $inc: { quantity: -1 } },
      { new: true }
    );

   
    if (prevQuantity && prevQuantity.quantity <= 0) {
      await Quantity.findOneAndDelete({
        bookAuthor: newRequest.bookAuthor,
        bookName: newRequest.bookName,
      });
    }
  } catch (error) {
    console.error('Error adding a new request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Return Book Route

router.post("/return-book", async (req, res) => {
  const { id, studentName, cardNumber, stream, bookName, bookAuthor, accessionNumber, returnDate } = req.body;

  try {
    console.log(`Attempting to return book with ID ${id}`);

    
    const newReturn = new Return({ studentName, cardNumber, stream, bookName, bookAuthor, accessionNumber, returnDate });
    await newReturn.save();

    console.log(`Added returned book to Return collection: ${newReturn}`);

    res.json(newReturn);

    const user_data = await User.findOne({ cardNo: newReturn.cardNumber });
    const email = user_data.email;
    const emailText = `${newReturn.studentName} Your  book ${newReturn.bookName} , Author: ${newReturn.bookAuthor} is Returned. Please Submit The Book In Library Within Your Return Date ,Otherwise fine will be added to Your Account .`;
    sendEmail(email, 'Book Returned', emailText);
  } catch (error) {
    console.error('Error handling book return:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Checck Requested Book

router.get("/requested-books", async (req, res) => {
  const { studentName, bookName, bookAuthor } = req.query;
  try {
    const existingRequest = await Request.find({
      studentName,
      bookName,
      bookAuthor,

    });

    res.json(existingRequest);
  } catch (error) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Route For Showing User Requested Books

router.get("/user-requested-books", async (req, res) => {
  const { cardNumber } = req.query;
  try {
    const existingBooks = await Request.find({
      cardNumber,
    });

    const extractedData = existingBooks.map((book) => ({
      _id: book._id,
      bookName: book.bookName,
      bookAuthor: book.bookAuthor,
      studentName: book.studentName,
    
    }));

    res.json(extractedData);
  } catch (error) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//User Approved Books

router.get("/user-approved-books", async (req, res) => {
  const { cardNumber } = req.query;
  try {
    const existingBooks = await ApproveBook.find({
      cardNumber,
    });
    const extractedData = existingBooks.map((book) => ({
      _id: book._id,
      bookName: book.bookName,
      bookAuthor: book.bookAuthor,
      studentName: book.studentName,
    
    }));

    res.json(extractedData);
  } catch (error) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SHow All Data From Approved Books

router.get("/approved-books", async (req, res) => {
  const { studentName, bookName, bookAuthor } = req.query;
  try {
    const existingRequest = await ApproveBook.find({
      studentName,
      bookName,
      bookAuthor,

    });

    res.json(existingRequest);
  } catch (error) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/show-request", async (req, res) => {
  const request = await Request.find();
  res.json(request);
})

//SHow All Data From Request Books

router.get("/request-find", async (req, res) => {
  try {
    const { cardNo } = req.query;
    const value = await Request.find({ cardNumber: cardNo })
    res.json(value);
    console.log(value)
  }
  catch (e) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
//To show the approved data from the student name

router.get("/approve-find", async (req, res) => {
  try {
    const { cardNo } = req.query;
    const value = await ApproveBook.find({ cardNumber: cardNo })
    res.json(value);
    console.log(value)
  }
  catch (e) {
    console.error("Error fetching existing requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

//To Check the Book Quantity

router.post("/check-quantity", async (req, res) => {
  const { bookName, bookAuthor } = req.body;
  try {
    const quantity = await Quantity.findOne({ bookAuthor: bookAuthor, bookName: bookName });
   
    if (quantity && quantity.quantity >= 1) {
      return res.json({ quantity: quantity.quantity });

    } else {
      return res.json({ quantity: 0 });
    }
  } catch (error) {
    console.error("Error checking quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//TO Approve Books from admin
router.post("/approve-book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const requestedBook = await Request.findById(id);
   
    const returnDate = calculateReturnDate();

   
    await ApproveBook.create({
      studentName: requestedBook.studentName,
      cardNumber: requestedBook.cardNumber,
      bookName: requestedBook.bookName,
      bookAuthor: requestedBook.bookAuthor,
      accessionNumber: requestedBook.accessionnumber,
      returnDate: returnDate,
    });
    const allBook = await AllBook.findOneAndUpdate(
      { accessionnumber: accession },
      {
        $push: {
          approvals: {
            cardNumber: requestedBook.cardNumber,
            studentName: requestedBook.studentName,
            approvalDate: new Date(),
          },
        },
      },
      { new: true }
    );
    const user_data = await User.findOne({ cardNo: requestedBook.cardNumber });
    const email = user_data.email;

    console.log("Book Approved");
   
    await Request.findByIdAndDelete(id);

    const emailText = `${requestedBook.studentName} Your requested book ${requestedBook.bookName}, Author: ${requestedBook.bookAuthor} is approved of card no: ${requestedBook.cardNumber}. Please collect your book from Library. Your Return Date is : ${returnDate.toDateString()}`;
    sendEmail(email, 'Book Approved', emailText);

  
    return res.json({ message: "Book approved successfully" });


  } catch (error) {
    console.error("Error approving book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



function calculateReturnDate() {
  const currentDate = new Date();
  const returnDate = new Date(currentDate);
  returnDate.setMonth(returnDate.getMonth() + 3);
  return returnDate;
}


router.get('/show-allbooks', async (req, res) => {
  try {
    const allbooks = await AllBook.find();
    res.json(allbooks)
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})
router.get("/show-approrve", async (req, res) => {
  try {
    const students = await ApproveBook.find();
    res.json(students);
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
});


router.delete("/delete-request/:id", async (req, res) => {
  const { id } = req.params;
  try {
    
    const requestedBook = await Request.findById(id);

    if (!requestedBook) {
      return res.status(404).json({ error: "Request not found" });
    }

    await Request.findByIdAndDelete(id);

    const prevQuantity = await Quantity.findOneAndUpdate(
      { bookAuthor: requestedBook.bookAuthor, bookName: requestedBook.bookName },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    
    if (prevQuantity && prevQuantity.quantity <= 0) {
      await Quantity.findOneAndDelete({
        bookAuthor: requestedBook.bookAuthor,
        bookName: requestedBook.bookName,
      });
    }

    const user_data = await User.findOne({ cardNo: requestedBook.cardNumber });
    const email = user_data.email;
    const emailText = `${requestedBook.studentName} Your requested book ${requestedBook.bookName}, Author: ${requestedBook.bookAuthor} is not available. Please request other books.`;
    sendEmail(email, 'Book Not Available', emailText);

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/accept-book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const returnBook = await Return.findById(id);
    await ApproveBook.findOneAndDelete({ accessionNumber: returnBook.accessionNumber })
    if (!returnBook) {
      return res.status(404).json({ error: 'Return record not found' });
    }

    
    await Return.findByIdAndDelete(id);

    const { bookName, bookAuthor, accessionNumber } = returnBook;

    
    const existingBook = await Quantity.findOne({ bookAuthor, bookName });

    if (!existingBook) {
      
      const newQuantity = new Quantity({ bookAuthor, bookName, quantity: 1 });
      await newQuantity.save();
    } else {
      
      existingBook.quantity += 1;
      await existingBook.save();
    }

    const purchasedate_data = await AllBook.findOne({ accessionnumber: accessionNumber });
    const purchasedate = purchasedate_data.purchasedate;
    const newBook = new Book({ name: bookName, author: bookAuthor, accessionnumber: accessionNumber, purchasedate: purchasedate });
    await newBook.save();

    res.json({ message: 'Book accepted successfully' });
    const user_data = await User.findOne({ cardNo: returnBook.cardNumber });
    const email = user_data.email;
    const emailText = `${returnBook.studentName} Your returned book ${returnBook.bookName}, Author: ${returnBook.bookAuthor} is accepted of card no: ${returnBook.cardNumber}`;
    sendEmail(email, 'Book Accepted', emailText);

  } catch (error) {
    console.error('Error accepting book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/showreturn", async (req, res) => {
  try {
    const return_book = await Return.find();
    res.json(return_book);
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
});

router.get("/showbookquantity", async (req, res) => {
  try {
    const return_book = await Quantity.find();
    res.json(return_book);
  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
});

module.exports = router;


router.get('/get-approval-details/:accessionNumber', async (req, res) => {
  try {
    const { accessionNumber } = req.params;

    
    const book = await AllBook.findOne({ accessionnumber: accessionNumber });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

  
    res.json({ accessionnumber: book.accessionnumber, approvals: book.approvals });
  } catch (error) {
    console.error("Error fetching approval details:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/editstudent/:id', async (req, res) => {
  try {
    console.log("Received PUT request:", req.params.id, req.body);
    const { id } = req.params
   
    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated student:", updatedStudent);
    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Error updating student" });
  }
});


router.delete("/deletestudent/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
});

router.post('/save-message', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("Received message:", { name, email, message });

    const data = new Message({ name, email, message });
    await data.save();

    console.log("Message saved successfully");
    res.status(200).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Error saving message" });
  }
});


router.post("/renew-book", async (req, res) => {
  const { accessionNumber } = req.body;
  const returnDate = calculateReturnDate();
  try {
   
    const returnBook = await Return.findOne({ accessionNumber })
    const card = returnBook.cardNumber;
    await Return.deleteOne({ accessionNumber });

    
    const renewedBook = await ApproveBook.findOneAndUpdate(
      { accessionNumber },
      { $set: { returnDate } },
      { new: true }
    );

    res.json(renewedBook);
    const user_data = await User.findOne({ cardNo: card });
    const email = user_data.email;
    const emailText = `${returnBook.studentName} Your returned book ${returnBook.bookName}, Author: ${returnBook.bookAuthor} is Renewed and Updated Return Date Will be shown Into your Profile ,Please check .  card no: ${returnBook.cardNumber}`;
    sendEmail(email, 'Book Renewed', emailText);
  } catch (error) {
    console.error("Error renewing book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

