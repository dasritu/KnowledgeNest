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
                <StyledTableCell align="center">{user.returnDate}</StyledTableCell>
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
        <h2>Approved Books for {selectedUser?.studentName}</h2>
        <MdClose size={24} onClick={handleCloseModal} style={{ cursor: "pointer" }} />
        <ul>
          {selectedUser?.approvedBooks.map((book) => (
            <li key={book._id}>
              {book.bookName} by {book.bookAuthor}
            </li>
          ))}
        </ul>
      </Modal>

      <ToastContainer />
    </div>
  );
};

