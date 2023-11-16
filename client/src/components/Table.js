import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import axios from "axios";
import "../styles/Table.css";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { MdClose } from "react-icons/md";
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

export default function CustomizedTables() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
        setUsers(data);
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
      setSelectedUser({ ...user, approvedBooks: data });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching approved books:", error);
      toast.error("Error fetching approved books");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = async (user) => {
    try {
      // Implement the logic to delete the user
      const confirm=window.confirm("Are You Sure to Delete The student?")
      if(confirm){
      await axios.delete(`/deletestudent/${user._id}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
      toast.success("User deleted successfully");
      const fetchDataResponse = await fetch("/showstudent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      const data = await fetchDataResponse.json();
      setUsers(data);
    }
    else{
      return
    }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
  
      const updatedUserResponse = await axios.put(
        `/editstudent/${selectedUser._id}`,
        selectedUser
      );
  
      setSelectedUser(updatedUserResponse.data);
      setIsEditModalOpen(false);
  
      // Refetch the data to ensure it's up to date
      const fetchDataResponse = await fetch("/showstudent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      const data = await fetchDataResponse.json();
      setUsers(data);
      
      setIsLoading(false);
      toast.success(`Student Updated successfully!`);
      alert("Student Updated")
    } catch (error) {
      console.error("Error updating student details:", error);
      toast.error("Error updating student details");
      setIsLoading(false);
    }
  };
  
  
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Card No.</StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Stream</StyledTableCell>
              <StyledTableCell align="center">Year</StyledTableCell>
              <StyledTableCell align="center">PhoneNumber</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user._id}>
                <StyledTableCell component="th" scope="row">
                  {user.cardNo}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  onClick={() => handleUserClick(user)}
                  style={{ cursor: "pointer" }}
                >
                  {user.name}
                </StyledTableCell>
                <StyledTableCell align="center">{user.email}</StyledTableCell>
                <StyledTableCell align="center">{user.stream}</StyledTableCell>
                <StyledTableCell align="center">{user.year}</StyledTableCell>
                <StyledTableCell align="center">{user.phone}</StyledTableCell>
                <StyledTableCell align="center">
              <button onClick={() => handleEditClick(user)} style={{color:"black"}}>Edit</button>
              <button onClick={() => handleDeleteClick(user)} style={{color:"black"}}>Delete </button>
            </StyledTableCell>
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
            Approved Books for <strong>{selectedUser?.name}</strong>
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
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={handleCloseEditModal}
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
          <h2 style={{ textAlign: "center", color: "white", fontSize: "30px" }}>
            Edit Student Details
          </h2>
          <MdClose
            size={24}
            onClick={handleCloseEditModal}
            style={{ cursor: "pointer" }}
          />
        </div>
        <form onSubmit={handleEditSubmit}>
  <label>
    Card No.:
    <input
      type="text"
      value={selectedUser?.cardNo || ""}
      onChange={(e) =>
        setSelectedUser((prevUser) => ({
          ...prevUser,
          cardNo: e.target.value,
        }))
      }
    />
  </label>
  <label>
    Student Name:
    <input
      type="text"
      value={selectedUser?.name || ""}
      onChange={(e) =>
        setSelectedUser((prevUser) => ({
          ...prevUser,
          name: e.target.value,
        }))
      }
    />
  </label>
  <label>
    Phone Number:
    <input
      type="text"
      value={selectedUser?.phone || ""}
      onChange={(e) =>
        setSelectedUser((prevUser) => ({
          ...prevUser,
          phone: e.target.value,
        }))
      }
    />
  </label>
 
  <button type="submit">Save Changes</button>
</form>

      </Modal>
    </>
  );
}