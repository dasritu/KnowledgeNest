// Assuming you have React and state management (e.g., useState, useEffect) set up

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Books.css";
import { FiSave } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BookManagementComponent = () => {
  const [books, setBooks] = useState([]);
  const [editableBook, setEditableBook] = useState({
    id: "",
    name: "",
    author: "",
    purchasedate: "",
    accessionnumber: "",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/showbooks");
        setBooks(response.data.reverse());
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleEditBook = (id) => {
    const selectedBook = books.find((book) => book._id === id);
    setEditableBook({
      id: selectedBook._id,
      name: selectedBook.name,
      author: selectedBook.author,
      purchasedate: selectedBook.purchasedate,
      accessionnumber: selectedBook.accessionnumber,
    });
  };

  const handleUpdateBook = async () => {
    try {
      const response = await axios.put(
        `/updatebook/${editableBook.id}`,
        editableBook
      );
      const updatedBooks = books.map((book) =>
        book._id === editableBook.id ? response.data : book
      );
      setBooks(updatedBooks);
      setEditableBook({
        id: "",
        name: "",
        author: "",
        purchasedate: "",
        accessionnumber: "",
      });
    } catch (error) {
      console.error("Error updating book:", error);
    }
    toast.success(`Book Updated successfully!`);
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/deletebook/${id}`);
      const updatedBooks = books.filter((book) => book._id !== id);
      setBooks(updatedBooks);
      const BookName=updatedBooks.name;
      toast.success(`Book ${BookName} Deleted successfully!`);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
   
  };

  const handleAddRecord = () => {
    // Set the editable book to the newly added record
    const newEditableBook = {
      id: "new",
      name: "",
      author: "",
      purchasedate: "",
      accessionnumber: "",
    };
  
    // Add the new record at the beginning of the books array
    setBooks([newEditableBook, ...books]);
  
    // Set the editable book
    setEditableBook(newEditableBook);
  };
  

  const handleAddBook = async () => {
    try {
      const response = await axios.post("/addbook", editableBook);
      const updatedBooks = books.map((book) =>
        book.id === "new" ? response.data : book
      );
      setBooks(updatedBooks);
      setEditableBook({
        id: "",
        name: "",
        author: "",
        purchasedate: "",
        accessionnumber: "",
      });
    } catch (error) {
      console.error("Error adding a new book:", error);
    }
    toast.success(`Book  Added successfully!`);
  };
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <h2 className="heading1">
          <div> Books </div>
          <div>
            {editableBook.id === "new" ? (
              <>
                <button onClick={handleAddBook} style={{ color: "white" }}>
                  <FiSave />
                </button>
                <button
                  onClick={() =>
                    setEditableBook({
                      id: "",
                      name: "",
                      author: "",
                      purchasedate: "",
                      accessionnumber: "",
                    })
                  }
                  style={{ color: "white" }}
                >
                  <GiCancel />
                </button>
              </>
            ) : (
              <button onClick={handleAddRecord} style={{ color: "white" }}>
                + Add Book
              </button>
            )}
          </div>
        </h2>

        {/* View Books Table */}
        <div>
          {/* <h3>View Books</h3> */}
          <table className="table-container">
            <thead>
              <tr>
                <th style={{ width: "220px", textAlign: "center" }}>
                  Accession Number
                </th>
                <th style={{ width: "220px", textAlign: "center" }}>
                  Book Name
                </th>
                <th style={{ width: "220px", textAlign: "center" }}>Author</th>
                <th style={{ width: "220px", textAlign: "center" }}>
                  Purchase Date
                </th>
                <th style={{ width: "280px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    {book._id === editableBook.id || book.id === "new" ? (
                      <input
                        type="text"
                        value={editableBook.accessionnumber}
                        onChange={(e) =>
                          setEditableBook({
                            ...editableBook,
                            accessionnumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      book.accessionnumber
                    )}
                  </td>

                  <td>
                    {book._id === editableBook.id || book.id === "new" ? (
                      <input
                        type="text"
                        value={editableBook.name}
                        onChange={(e) =>
                          setEditableBook({
                            ...editableBook,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      book.name
                    )}
                  </td>
                  <td>
                    {book._id === editableBook.id || book.id === "new" ? (
                      <input
                        type="text"
                        value={editableBook.author}
                        onChange={(e) =>
                          setEditableBook({
                            ...editableBook,
                            author: e.target.value,
                          })
                        }
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td>
                    {book._id === editableBook.id || book.id === "new" ? (
                      <input
                        type="date"
                        value={editableBook.purchasedate}
                        onChange={(e) =>
                          setEditableBook({
                            ...editableBook,
                            purchasedate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      book.purchasedate
                    )}
                  </td>
                  <td>
                    {book._id === editableBook.id ? (
                      <>
                        <button onClick={handleUpdateBook} style={{ color: "black" }}>Update</button>
                        <button
                          onClick={() =>
                            setEditableBook({
                              id: "",
                              name: "",
                              author: "",
                              purchasedate: "",
                              accessionnumber: "",
                            })
                          } style={{ color: "black" }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditBook(book._id)}
                          style={{ color: "black" }}
                        >
                          <BiEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          style={{ color: "black" }}
                        >
                          <MdDeleteForever />
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BookManagementComponent;
