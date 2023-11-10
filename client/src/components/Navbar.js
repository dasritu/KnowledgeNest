import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import "../styles/Navbar.css";
import read from "../image/reading.png";

export default function Navbar({ scrollToSection }) {
  const [role, setRole] = useState("user");
  const [scrolling, setScrolling] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navbarClass = scrolling ? "navbar scrolled" : "navbar";
  const mobileMenuBackground = mobileMenuOpen ? "#eed6ec" : "transparent";

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
            <NavLink
              className="nav-link"
              to="/"
              onClick={() => scrollToSection("home")}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={() => scrollToSection("about")}
              style={{ cursor: "pointer" }}
            >
              About Us
            </span>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={() => scrollToSection("contact")}
              style={{ cursor: "pointer" }}
            >
              Contact
            </span>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              Student Profile
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
        className={`${navbarClass} fixed-top navbar-expand-lg`}
        style={{ background: scrolling ? "#eed6ec" : "transparent" }}
      >
        <div className="container-fluid">
          <div className="logo">
            <img src={read} alt="" />
          </div>
          <a
            className="navbar-brand custom-brand nav-title"
            href="/"
            style={{ fontWeight: "bold", color: "purple" }}
          >
            KnowledgeNest
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => {
              handleMobileMenuToggle();
              document.body.style.overflow = mobileMenuOpen ? "auto" : "hidden";
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
          className={`collapse navbar-collapse custom-collapse ${
            mobileMenuOpen ? "mobile-menu-open" : ""
          }`}
          id="navbarSupportedContent"
          style={{ backgroundColor: mobileMenuBackground }}
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
