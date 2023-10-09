import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const[samebook,setsamebook]=useState(false);

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
  }, []);

  const handleRequest = async (bookId, bookName, bookAuthor,accessionnumber) => {
  
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      const data = await response.json();
      const studentName = data.name;
      const cardNumber = data.cardNo;
      const stream = data.stream;
  
      // Check if the student has already requested the book
      const existingRequest = await axios.get("/requested-books", {
        params: { studentName, bookName, bookAuthor },
      });
  
      if (existingRequest.data.length > 0) {
        alert("You have already requested this book.");
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
        accessionnumber
      });
  
      console.log(`Requested book with ID ${bookId}`);
    } catch (error) {
      console.error("Error making request:", error);
    }
  };
  
  return (
    <div>
      <h2>Book List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Accession Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>{book.accessionnumber}</td>
              <td>
                 
                 <button onClick={() => handleRequest(book._id,book.name,book.author,book.accessionnumber)} style={{ color: 'black' }} >Request</button>
                  
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
