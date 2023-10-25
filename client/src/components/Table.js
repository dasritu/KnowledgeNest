import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import axios from "axios";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from 'react-modal';
import { ToastContainer, toast } from "react-toastify";
import { MdClose } from "react-icons/md";
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

export default function CustomizedTables() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const[cardNumber,setCardNumber]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/showstudent", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
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
        params: { cardNo: user.cardNo },
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
            <StyledTableCell align="right">Student Name</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Stream</StyledTableCell>
            <StyledTableCell align="right">Year</StyledTableCell>
            <StyledTableCell align="right">PhoneNumber</StyledTableCell>
            {/* Add other headers as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Assuming user is an object with properties like cardNo, name, email, etc. */}
          {users.map((user) => (
            <StyledTableRow key={user._id}>
              <StyledTableCell component="th" scope="row">
                {user.cardNo}
              </StyledTableCell>
              <button style={{cursor:"ponter"}
                }><StyledTableCell align="center" onClick={() => handleUserClick(user)} >
                  {user.name}
                </StyledTableCell></button>
              <StyledTableCell align="right">{user.email}</StyledTableCell>
              <StyledTableCell align="right">{user.stream}</StyledTableCell>
              <StyledTableCell align="right">{user.year}</StyledTableCell>
              <StyledTableCell align="right">{user.phone}</StyledTableCell>
              {/* Add other cells as needed */}
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
            boxShadow:"17px 24px 48px grey",
            background:"rgb(190 166 194)",
            height:"50vh",
            borderRadius:"30px"
          },
         
        }}
      >
        <h2>Approved Books for {selectedUser?.name}</h2>
        <MdClose size={24} onClick={handleCloseModal} style={{ cursor: "pointer" }} />
        <ul>
  {selectedUser?.approvedBooks && selectedUser.approvedBooks.length > 0 ? (
    selectedUser.approvedBooks.map((book) => (
      <li key={book._id}>
        {book.bookName} by {book.bookAuthor}
      </li>
    ))
  ) : (
    <li>No books approved</li>
  )}
</ul>

      </Modal>
    </div>
  );
}
