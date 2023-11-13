import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal'; // Import the Modal component
import "../styles/Books.css";
import { FiSave } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookManagementComponent = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editableBook, setEditableBook] = useState({
    id: "",
    name: "",
    author: "",
    purchasedate: "",
    accessionnumber: "",
  });
  const [isAddButtonDisabled, setAddButtonDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [selectedBookDetails, setSelectedBookDetails] = useState({});

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
    const timeoutId = setTimeout(fetchBooks, 300);

    
    return () => clearTimeout(timeoutId);
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
      const BookName = updatedBooks.name;
      toast.success(`Book ${BookName} Deleted successfully!`);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleAddRecord = () => {
    const newEditableBook = {
      id: "new",
      name: "",
      author: "",
      purchasedate: "",
      accessionnumber: "",
    };

    setBooks([newEditableBook, ...books]);
    setEditableBook(newEditableBook);
  };

  const handleAddBook = async () => {
    try {
      setAddButtonDisabled(true);
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
      toast.success(`Book Added successfully!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Accession number already exists, show a warning
        toast.warning("Accession number already exists. Please choose a different one.");
      } else {
        // Other errors, log to console and show a generic error message
        console.error("Error adding a new book:", error);
        toast.error("Error adding a new book. Please try again.");
      }
    } finally {
      setAddButtonDisabled(false);
    }
  };
  
  const handleViewApprovalDetails = async (accessionNumber) => {
    try {
      const response = await axios.get(`/get-approval-details/${accessionNumber}`);
      setSelectedBookDetails(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };
  const handleCloseModal = () => {
    setModalIsOpen(false);
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
                {/* No buttons needed for new book */}
              </>
            ) : (
              <button
                onClick={handleAddRecord}
                style={{ color: "white" }}
                disabled={isAddButtonDisabled}
              >
                + Add Book
              </button>
            )}
          </div>
        </h2>

        <div>
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
                      <button onClick={() => handleViewApprovalDetails(book.accessionnumber)} style={{ color: "black" }}>
                        {book.accessionnumber}
                      </button>
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
                        value={editableBook.purchasedate.toString()}
                        onChange={(e) =>
                          setEditableBook({
                            ...editableBook,
                            purchasedate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      new Date(book.purchasedate).toLocaleDateString()
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
                        {book.id === "new" ? (
                          <>
                            <button
                              onClick={handleAddBook}
                              style={{ color: "black" }}
                            >
                              <FiSave />
                              Save
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
                              style={{ color: "black" }}
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
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
  isOpen={modalIsOpen}
  onRequestClose={handleCloseModal}
  style={{
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "17px 24px 48px grey",
      background: "purple",
      height: "50vh",
      width: "50vw",
      borderRadius: "30px",
      border: "1px solid #ddd", // Add a border to match the second modal
    },
  }}
>
  <div className="modal-content">
    <span className="close" onClick={() => setModalIsOpen(false)}>
      &times;
    </span>
    <h4 style={{ color: "white" }}>Approval Details for Accession Number: {selectedBookDetails.accessionnumber}</h4>
    {selectedBookDetails.approvals && selectedBookDetails.approvals.length > 0 ? (
      <table className="toaster-books" style={{ width: "100%" }}>
        <thead className="toaster-head">
          <tr>
            <th style={{ textAlign: "center", color: "white" }}>Student CardNumber</th>
            <th style={{ textAlign: "center", color: "white" }}>Student Name</th>
            <th style={{ textAlign: "center", color: "white" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {selectedBookDetails.approvals.map((approval, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", color: "white" }}>{approval.cardNumber}</td>
              <td style={{ textAlign: "center", color: "white" }}>{approval.studentName}</td>
              <td style={{ textAlign: "center", color: "white" }}>{approval.approvalDate && new Date(approval.approvalDate).toLocaleDateString()}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={{ textAlign: "center", color: "white" }}>No books approved</p>
    )}
  </div>
</Modal>

    </>
  );
};

export default BookManagementComponent;

