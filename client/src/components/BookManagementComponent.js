// Assuming you have React and state management (e.g., useState, useEffect) set up

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookManagementComponent = () => {
  const [books, setBooks] = useState([]);
  const [editableBook, setEditableBook] = useState({
    id: '',
    name: '',
    author: '',
    purchasedate: '',
    accessionnumber: '',
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/showbooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
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
      const response = await axios.put(`/updatebook/${editableBook.id}`, editableBook);
      const updatedBooks = books.map((book) =>
        book._id === editableBook.id ? response.data : book
      );
      setBooks(updatedBooks);
      setEditableBook({
        id: '',
        name: '',
        author: '',
        purchasedate: '',
        accessionnumber: '',
      });
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/deletebook/${id}`);
      const updatedBooks = books.filter((book) => book._id !== id);
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleAddRecord = () => {
    setBooks([
      ...books,
      {
        id: 'new',
        name: '',
        author: '',
        purchasedate: '',
        accessionnumber: '',
      },
    ]);
    // Set the editable book to the newly added record
    setEditableBook({
      id: 'new',
      name: '',
      author: '',
      purchasedate: '',
      accessionnumber: '',
    });
  };

  const handleAddBook = async () => {
    try {
      const newBooks = books.filter((book) => book.id !== 'new');
      const response = await axios.post('/addbook', editableBook);
      const updatedBooks = [...newBooks, response.data];
      setBooks(updatedBooks);
      setEditableBook({
        id: '',
        name: '',
        author: '',
        purchasedate: '',
        accessionnumber: '',
      });
    } catch (error) {
      console.error('Error adding a new book:', error);
    }
  };

  return (
    <div>
      <h2>Book Management</h2>

      {/* View Books Table */}
      <div>
        <h3>View Books</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Purchase Date</th>
              <th>Accession Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book._id === editableBook.id || book.id === 'new' ? <input type="text" value={editableBook.name} onChange={(e) => setEditableBook({ ...editableBook, name: e.target.value })} /> : book.name}</td>
                <td>{book._id === editableBook.id || book.id === 'new' ? <input type="text" value={editableBook.author} onChange={(e) => setEditableBook({ ...editableBook, author: e.target.value })} /> : book.author}</td>
                <td>{book._id === editableBook.id || book.id === 'new' ? <input type="date" value={editableBook.purchasedate} onChange={(e) => setEditableBook({ ...editableBook, purchasedate: e.target.value })} /> : book.purchasedate}</td>
                <td>{book._id === editableBook.id || book.id === 'new' ? <input type="number" value={editableBook.accessionnumber} onChange={(e) => setEditableBook({ ...editableBook, accessionnumber: e.target.value })} /> : book.accessionnumber}</td>
                <td>
                  {book._id === editableBook.id ? (
                    <>
                      <button onClick={handleUpdateBook}>Update</button>
                      <button onClick={() => setEditableBook({ id: '', name: '', author: '', purchasedate: '', accessionnumber: '' })}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditBook(book._id)} style={{ color: 'black' }}>Edit</button>
                      <button onClick={() => handleDeleteBook(book._id)} style={{ color: 'black' }}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Record Button */}
        <div>
          {editableBook.id === 'new' ? (
            <>
              <button onClick={handleAddBook} style={{ color: 'black' }}>Add Book</button>
              <button onClick={() => setEditableBook({ id: '', name: '', author: '', purchasedate: '', accessionnumber: '' })} style={{ color: 'black' }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAddRecord} style={{ color: 'black' }}>Add Record</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookManagementComponent;
