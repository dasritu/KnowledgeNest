import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [samebook, setsamebook] = useState(false);

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
        accessionnumber,
      });

      console.log(`Requested book with ID ${bookId}`);
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  return (
    <>
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
                      style={{ color: "black" }}
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
      </div>
    </>
  );
}
