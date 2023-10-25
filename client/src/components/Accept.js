import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
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
const ApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: "green",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "green",
    opacity: 0.8,
  },
}));

const RejectButton = styled(Button)(({ theme }) => ({
  backgroundColor: "red",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "red", // Keep it red on hover
    opacity: 0.8, // You can adjust the opacity
    cursor: "not-allowed", // Show the disabled cursor on hover
  },
}));

export default function Accept() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/showreturn", {
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

  const calculateFine = (returnDate) => {
    const finePerDay = 1; // 1 rupee per day
    const currentDate = new Date();
    const returnedDate = new Date(returnDate);
    const timeDifference = currentDate - returnedDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    const fine = daysDifference * finePerDay;

    return fine > 0 ? fine : 0;
  };
  const handleAccept = async (id, bookName, bookAuthor, accessionNumber) => {
    try {
      // Make a POST request to the /accept-book/:id route
      const response = await fetch(`/accept-book/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Assuming your server returns a JSON response, you can handle it here if needed
      const result = await response.json();
      console.log("Accept Book Response:", result);
      toast.success(`Book ${bookName} accepted successfully!`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error accepting book:", error);
    }
  };

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Card No. </StyledTableCell>
            <StyledTableCell align="center">Student Name</StyledTableCell>
            <StyledTableCell align="center">AcceaaionNumber</StyledTableCell>
            <StyledTableCell align="center">Book Name</StyledTableCell>
            <StyledTableCell align="center">Author</StyledTableCell>
            <StyledTableCell align="center">Return Date</StyledTableCell>
            <StyledTableCell align="center">Fine </StyledTableCell>
            <StyledTableCell align="center">Accept</StyledTableCell>
            <StyledTableCell align="center">Fine & Accept</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user._id}>
              <StyledTableCell align="left">{user.cardNumber}</StyledTableCell>
              <StyledTableCell align="center">{user.studentName}</StyledTableCell>
              <StyledTableCell align="center">{user.accessionNumber}</StyledTableCell>
              <StyledTableCell align="center">{user.bookName}</StyledTableCell>
              <StyledTableCell align="center">{user.bookAuthor}</StyledTableCell>
              <StyledTableCell align="center">{user.returnDate}</StyledTableCell>
              <StyledTableCell align="center">{calculateFine(user.returnDate)}</StyledTableCell>
              <StyledTableCell align="center">
                <ApproveButton onClick={() => handleAccept(user._id, user.bookName, user.bookAuthor, user.accessionNumber)}> 
                  Accept
                  <SendIcon />
                </ApproveButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                <RejectButton>Fine & Accept</RejectButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
    
  );
}
