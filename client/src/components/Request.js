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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "purple", 
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
    backgroundColor: "red",
    opacity: 0.8,
   
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

           
            toast.success(`Book  Approved successfully!`);
            setUsers((prevUsers) =>
              prevUsers.filter((prevUser) => prevUser._id !== user._id)
            );
            
          } else {
            console.error(`Error approving book`);
          }
        
    } catch (error) {
      console.error("Error approving book:", error);
    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Card No. </StyledTableCell>
            <StyledTableCell align="center">Student Name</StyledTableCell>
            <StyledTableCell align="center">Stream</StyledTableCell>
            <StyledTableCell align="center">Book Name</StyledTableCell>
            <StyledTableCell align="center">Author</StyledTableCell>
            <StyledTableCell align="center">Accsession Number</StyledTableCell>
            <StyledTableCell align="center">Requested Time</StyledTableCell>
            <StyledTableCell align="center">Approve</StyledTableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user._id}
            sx={{ height: '50px' }}>
              <StyledTableCell align="left">{user.cardNumber}</StyledTableCell>
              <StyledTableCell align="center">
                {user.studentName}
              </StyledTableCell>
              <StyledTableCell align="center">{user.stream}</StyledTableCell>
              <StyledTableCell align="center">{user.bookName}</StyledTableCell>
              <StyledTableCell align="center">
                {user.bookAuthor}
              </StyledTableCell>
              <StyledTableCell align="center">
                {user.accessionnumber}
              </StyledTableCell>
              <StyledTableCell align="center">
                {user.requestDateTime}
              </StyledTableCell>
              <StyledTableCell align="center">
                <ApproveButton onClick={() => handleApprove(user)}>
                  Approve
                  <SendIcon />
                </ApproveButton>
              </StyledTableCell>
              
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
