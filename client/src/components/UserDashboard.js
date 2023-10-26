import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [samebook, setsamebook] = useState(false);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [name, setName] = useState();
  const fetchRequestedBooks = async () => {
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      const cardNumber = data.cardNo;
      setName(data.name)

      const requestedBooksResponse = await axios.get("/request-find", {
        params: { cardNo: cardNumber },
      });

      setRequestedBooks(
        Array.isArray(requestedBooksResponse.data)
          ? requestedBooksResponse.data
          : [requestedBooksResponse.data]
      );
    } catch (error) {
      console.error("Error fetching requested books:", error);
    }
  };

  const fetchApprovedBooks = async () => {
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      const cardNumber = data.cardNo;

      const approvedBooksResponse = await axios.get("/approve-find", {
        params: { cardNo: cardNumber },
      });

      setApprovedBooks(
        Array.isArray(approvedBooksResponse.data)
          ? approvedBooksResponse.data
          : [approvedBooksResponse.data]
      );
    } catch (error) {
      console.error("Error fetching approved books:", error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/showbooks");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
    fetchRequestedBooks();
    fetchApprovedBooks();
  }, []);

  const handleRequest = async (
    bookId,
    bookName,
    bookAuthor,
    accessionnumber
  ) => {
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      const { name: studentName, cardNo: cardNumber, stream } = data;

      const existingRequest = await axios.get("/requested-books", {
        params: { studentName, bookName, bookAuthor },
      });

      const existingApproval = await axios.get("/approved-books", {
        params: { studentName, bookName, bookAuthor },
      });

      if (existingRequest.data.length > 0) {
        alert("You have already requested this book.");
        setsamebook(true);
        return;
      }
      const userRequestedBooksResponse = await axios.get("/user-requested-books", {
        params: { cardNumber: cardNumber },
      });
      const userApprovedBooksResponse = await axios.get("/user-approved-books", {
        params: { cardNumber: cardNumber },
      });
      const userApprovedBooksCount = userApprovedBooksResponse.data.length;
      if (userApprovedBooksCount >= 5) {
        alert("You cannot request more thann 5 books because your 5 books are already approved..");
        return;
      }
      // console.warn("data,",userRequestedBooksResponse);
      const userRequestedBooksCount = userRequestedBooksResponse.data.length;
      
      console.log(userRequestedBooksCount)
      // Check if the user has already requested or been approved for this book
      if (userRequestedBooksCount >= 5) {
        alert("You cannot request more than 5 books.");
        return;
      }
      if (existingApproval.data.length > 0) {
        alert("You have already been approved for this book.");
        setsamebook(true);
        return;
      }

      const confirmRequest = window.confirm(
        "Are you sure you want to request this book?"
      );

      if (!confirmRequest) {
        return;
      }

      await axios.post("/request-book", {
        studentName,
        cardNumber,
        stream,
        bookName,
        bookAuthor,
        accessionnumber,
      });

      console.log(`Requested book with ID ${bookId}`);

      // Update the state to include the newly requested book
      setRequestedBooks((prevRequestedBooks) => [
        ...prevRequestedBooks,
        {
          _id: bookId, // Adjust the ID based on your API response
          bookName,
          bookAuthor,
          studentName,
        },
      ]);
    } catch (error) {
      console.error("Error making request:", error);
    }
    toast.success(`Book ${bookName} requested successfully!`);

  };

  const handleReturn = async (id, bookName, bookAuthor, accessionNumber) => {
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      const { name: studentName, cardNo: cardNumber } = data;
      const currentDate = new Date().toLocaleDateString();

      // Make the API call to return the book
      await axios.post("/return-book", {
        id,
        studentName,
        cardNumber,
        bookName,
        bookAuthor,
        accessionNumber,
        returnDate: currentDate,
      });

      // Update the state to remove the returned book
      setApprovedBooks((prevApprovedBooks) =>
        prevApprovedBooks.filter((book) => book._id !== id)
      );

      // Optionally, you can update the requestedBooks state as well if needed

      console.log(`Returned book with ID ${id}`);
      alert("Book Returned");
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <>
              <div className="heading-user">
            <h3>Student</h3>
            <h3>Welcome {name}</h3>
          </div>
     <ToastContainer position="top-right" autoClose={3000} />
      <div className="sec1">
        <div className="book-show">
          <table className="user-table">
            <thead>
              <tr>
                <th className="table-heading">Accession Number</th>
                <th className="table-heading">Name</th>
                <th className="table-heading">Author</th>
                <th className="table-heading">Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="table-data">{book.accessionnumber}</td>
                  <td className="table-data">{book.name}</td>
                  <td className="table-data">{book.author}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleRequest(
                          book._id,
                          book.name,
                          book.author,
                          book.accessionnumber
                        )
                      }
                      style={{
                        color: "black",
                        backgroundColor: "#149d14",
                        color: "white",
                        borderRadius: "5px",
                      }}
                      className="table-data"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="notice">
          <div className="notice-header">
            <span className="notice-icon"></span>{" "}
            {/* You can replace 'ℹ️' with the icon of your choice */}
            <h3>
              📌<b>Notice</b>
            </h3>
          </div>
          <ul>
            <li>You can Request:</li>
            <ol>
              <li>Artificial Intelligence</li>
              <li>Design & Analysis of Algorithm</li>
              <li>Software Engineering</li>
              <li>Web Technology using PHP</li>
              <li>Operational Research</li>
            </ol>
          </ul>
        </div>
        <div className="requestedbook"></div>
      </div>
      <div className="sec-2">
        <div className="part1">
          <h1 style={{fontSize: "30px"}}><b>Your Requested Books</b></h1>
          <table className="user-table">
            <thead>
              <tr>
                <th className="table-heading">Book Name</th>
                <th className="table-heading">Book Author</th>
                <th className="table-heading">Student Name</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {requestedBooks.map((requestedBook) => (
                <tr key={requestedBook._id}>
                  <td className="table-data">{requestedBook.bookName}</td>
                  <td className="table-data">{requestedBook.bookAuthor}</td>
                  <td className="table-data">{requestedBook.studentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="part2">
          <h1 style={{fontSize: "30px"}}><b>Your Approved Books</b></h1>
          <table className="user-table">
            <thead>
              <tr>
                <th className="table-heading">Book Name</th>
                <th className="table-heading">Book Author</th>
                <th className="table-heading">Student Name</th>
                <th className="table-heading">Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {approvedBooks.map((approvedBook) => (
                <tr key={approvedBook._id}>
                  <td className="table-data">{approvedBook.bookName}</td>
                  <td className="table-data">{approvedBook.bookAuthor}</td>
                  <td className="table-data">{approvedBook.studentName}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleReturn(
                          approvedBook._id,
                          approvedBook.bookName,
                          approvedBook.bookAuthor,
                          approvedBook.accessionNumber
                        )
                      }
                      style={{
                        color: "white",
                        backgroundColor: "#149d14",
                        borderRadius: "5px",
                      }}
                      className="table-data"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
