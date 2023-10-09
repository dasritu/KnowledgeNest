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
import Stack from "@mui/material/Stack";

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
      // cursor: "not-allowed", // Show the disabled cursor on hover
    },
  }));

export default function Request() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/show-request", {
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

  const handleApprove = async (user) => {
    try {
      const bookDetails = {
        bookName: user.bookName,
        bookAuthor: user.bookAuthor,
      };
  
      // Check if the book details are present in the quantitySchema
      const response = await fetch("/check-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookDetails),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // If quantity is greater than or equal to 1, proceed with approval
        if (data.quantity >= 1) {
          // Make a request to approve the book
          const approveResponse = await fetch(`/approve-book/${user._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
  
          if (approveResponse.ok) {
            const approveData = await approveResponse.json();
            console.log(approveData);
  
            // Show an alert after successful approval
            alert("Book approved successfully!");
            setUsers((prevUsers) =>
            prevUsers.filter((prevUser) => prevUser._id !== user._id)
          );
            // Update the state or perform any other actions as needed
          } else {
            console.error(`Error approving book`);
          }
        } else {
          console.log("Not enough quantity to approve");
          alert('Not Enough Quantity To approve')
        }
      } else {
        console.error(`Error checking quantity`);
      }
    } catch (error) {
      console.error("Error approving book:", error);
    }
  };
  
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Card No. </StyledTableCell>
            <StyledTableCell align="center">Student Name</StyledTableCell>
            <StyledTableCell align="center">Stream</StyledTableCell>
            <StyledTableCell align="center">Book Name</StyledTableCell>
            <StyledTableCell align="center">Author</StyledTableCell>
            <StyledTableCell align="center">Approve</StyledTableCell>
            <StyledTableCell align="center">Reject</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user._id}>
              <StyledTableCell align="left">{user.cardNumber}</StyledTableCell>
              <StyledTableCell align="center">{user.studentName}</StyledTableCell>
              <StyledTableCell align="center">{user.stream}</StyledTableCell>
              <StyledTableCell align="center">{user.bookName}</StyledTableCell>
              <StyledTableCell align="center">{user.bookAuthor}</StyledTableCell>
              <StyledTableCell align="center">
                <ApproveButton onClick={() => handleApprove(user)}
                >
                  Approve
                  <SendIcon />
                </ApproveButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                <RejectButton>
                  Reject
                  <DeleteIcon />
                </RejectButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
