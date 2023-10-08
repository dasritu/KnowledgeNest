import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import Admin from './Admin';
//import Chart from './Chart';
// import Books from "./Books";
import "../styles/Home.css";
import AdminDashboard from "./AdminDashboard";
import CustomizedTables from "./Table";
import { MdSpaceDashboard } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { IoIosPeople } from "react-icons/io";
import { BiSolidNotification } from "react-icons/bi";
import BookManagementComponent from "./BookManagementComponent";

import UserDashboard from "./UserDashboard";
import Request from "./Request";
import Accept from "./Accept";
import { FcAcceptDatabase } from "react-icons/fc";


export default function Home() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("user");
  const [show, setShow] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(
    <AdminDashboard />
  );

  const userHome = async () => {
    try {
      const response = await fetch("/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setUserName(data.name);
      setShow(true);
      if (data.role === "admin") {
        setRole("admin");
      }
    } catch (e) {
      console.error("Catch Error:", e);
    }
  };

  useEffect(() => {
    userHome();
  }, []);

  const handleNavLinkClick = (component) => {
    setSelectedComponent(component);
  };

  if (role === "admin") {
    return (
      <>
        <div className="main">
          <div className="header">
            <h1>{show ? "Admin" : "This is Home Page"}</h1>
            <h1>Welcome {userName}</h1>
          </div>
          <div className="dashboard">
            <div className="left-side">
              <ul>
                <li>
                  <button
                    onClick={() => handleNavLinkClick(<AdminDashboard />)}
                  >
                    <MdSpaceDashboard />
                    Dashboards
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handleNavLinkClick(<BookManagementComponent />)
                    }
                  >
                    <ImBooks />
                    Books
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavLinkClick(<CustomizedTables />)}
                  >
                    <IoIosPeople />
                    Students
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavLinkClick(<Request />)}>
                    <BiSolidNotification />
                    Requests
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavLinkClick(<Accept />)}>
                    <FcAcceptDatabase  />
                    Return
                  </button>
                </li>
              </ul>
            </div>
            <div className="right-side">{selectedComponent}</div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <p className="pt-5 mt-5">WELCOME</p>
        <h3>KnowledgeNest</h3>
        <h1>{userName}</h1>
        
      {show && <h1>Hello User</h1>}
      {show && <UserDashboard />}
      </div>
    );
  }
 
}
