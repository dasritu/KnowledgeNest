import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import "../styles/Navbar.css";



export default function Navbar() {
  const [role, setRole] = useState("user");

  const { state, dispatch } = useContext(UserContext);

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
      if (data.role === "admin") {
        setRole("admin");
      } else {
        setRole("user");
      }
    } catch (e) {
      console.error("Catch Error:", e);
    }
  };
  userHome();
  useEffect(() => {
    if (state) {
      localStorage.setItem("role", role);
    }
  }, [state, role]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      dispatch({ type: "USER", payload: true });
    } else {
      dispatch({ type: "USER", payload: false });
    }
  }, []);

  const RenderMenu = () => {
    if (state) {
      if (role === "user") {
        return (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                Student Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </li>
          </>
        );
      } else {
        return (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                
                Dasboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/logout">
                Logout
              </NavLink>
            </li>
          </>
        );
      }
    } else {
      return (
        <>
          <li className="nav-item">
            <NavLink className="nav-link "  aria-current="page" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              Student Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/contact">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/signup">
              Signup
            </NavLink>
          </li>
        </>
      );
    }
  };
  return (
    <div>
      <nav
        className="navbar fixed-top navbar-expand-lg "
        style={{ background: "purple" }}
      >
        <div className="container-fluid">
          <a
            className="navbar-brand custom-brand"
            href="/"
            style={{ fontWeight: "bold", "font-size": "28px", color: "white" }}
          >
            Library Path
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse custom-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ms-auto">
              <RenderMenu />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
