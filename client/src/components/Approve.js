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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Card No. </StyledTableCell>
            <StyledTableCell align="center">Student Name</StyledTableCell>
            {/* <StyledTableCell align="center">Stream</StyledTableCell> */}
            <StyledTableCell align="center">Accession No.</StyledTableCell>
            
            <StyledTableCell align="center">Book Name</StyledTableCell>
            <StyledTableCell align="center">Book Author</StyledTableCell>
            <StyledTableCell align="center">Return Date</StyledTableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Assuming user is an object with properties like cardNo, name, email, etc. */}
          {users.map((user) => (
            <StyledTableRow key={user._id}>
              <StyledTableCell component="th" scope="row">
                {user.cardNumber}
              </StyledTableCell>
              <StyledTableCell align="center">{user.studentName}</StyledTableCell>
              {/* <StyledTableCell align="center">{user.stream}</StyledTableCell> */}
              <StyledTableCell align="center">{user.accessionNumber}</StyledTableCell>
              <StyledTableCell align="center">{user.bookName}</StyledTableCell>
              <StyledTableCell align="center">{user.bookAuthor}</StyledTableCell>
              <StyledTableCell align="center">{user.returnDate}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
