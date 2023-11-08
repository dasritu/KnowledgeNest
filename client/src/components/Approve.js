import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import axios from "axios";
import { MdClose } from "react-icons/md";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from 'react-modal';
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "purple", // Change to your desired background color
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Approve() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const[cardNumber,setCardNumber]=useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/show-approrve", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        //setCardNumber(data.cardNumber);
        console.log(data);

        // Set the data directly to the state
        setUsers(data);
        console.log(users);
      } catch (e) {
        console.error("Catch Error:", e);
      }
    };

    fetchData();
  }, []);
  const handleUserClick = async (user) => {
    try {
      const requestedBooksResponse = await axios.get("/approve-find", {
        params: { cardNo: user.cardNumber },
      });
      const data = await requestedBooksResponse.data;
      // Assuming data is an array of approved books for the selected student
      setSelectedUser({ ...user, approvedBooks: data });
      setIsModalOpen(true)
      console.log(data)
    } catch (error) {
      console.error("Error fetching approved books:", error);
      // Handle error or show a notification
      toast.error("Error fetching approved books");
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Card No. </StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Accession No.</StyledTableCell>
              <StyledTableCell align="center">Book Name</StyledTableCell>
              <StyledTableCell align="center">Book Author</StyledTableCell>
              <StyledTableCell align="center">Return Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user._id}>
                <StyledTableCell component="th" scope="row">
                  {user.cardNumber}
                </StyledTableCell>
                <button style={{cursor:"ponter"}
                }><StyledTableCell align="center" onClick={() => handleUserClick(user)} >
                  {user.studentName}
                </StyledTableCell></button>
                <StyledTableCell align="center">{user.accessionNumber}</StyledTableCell>
                <StyledTableCell align="center">{user.bookName}</StyledTableCell>
                <StyledTableCell align="center">{user.bookAuthor}</StyledTableCell>
                <StyledTableCell align="center">  {new Date(user.returnDate).toLocaleDateString()}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
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
          },
        }}
      >
        <div className="toast-heading">
          <h2 style={{ textAlign: "center", color: "white", fontSize:"30px" }}>
            Approved Books for <strong>{selectedUser?.studentName}</strong>
          </h2>
          <MdClose
            size={24}
            onClick={handleCloseModal}
            style={{ cursor: "pointer" }}
          />
        </div>
        <ul>
          {selectedUser?.approvedBooks && selectedUser.approvedBooks.length > 0 ? (
            <table className="toaster-books">
              <thead className="toaster-head">
                <tr>
                  <th style={{ textAlign: "center" }}>Book Accession Number</th>
                  <th style={{ textAlign: "center" }}>Book Name</th>
                  <th style={{ textAlign: "center" }}>Author Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.approvedBooks.map((book) => (
                  <tr key={book._id}>
                  <td style={{ textAlign: "center" , color:"white"}}>{book.accessionNumber}</td>
                  <td style={{ textAlign: "center" , color:"white"}}>{book.bookName}</td>
                  <td style={{ textAlign: "center" , color:"white"}}>{book.bookAuthor}</td>
                </tr>
                ))}
              </tbody>
            </table>
          ) : (
              <li style={{ textAlign: "center", color: "white" }}>No books approved</li>
          )}
        </ul>
      </Modal>

      <ToastContainer />
    </div>
  );
};

