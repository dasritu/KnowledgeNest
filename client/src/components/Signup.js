import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sign from "../image/signup.png";
import "../styles/Signup.css";

export default function Signup() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const history = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    stream: "BCA",
    year: "First",
    phone: "",
    password: "",
    cpassword: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, stream, year, phone, password, cpassword } = user;

    if (!termsAccepted) {
      window.alert("Please accept the terms and conditions.");
      return;
    }

    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        stream,
        year,
        phone,
        password,
        cpassword,
      }),
    });
    const data = await res.json();

    if (res.status === 422 || !data.message) {
      window.alert("Invalid Registration");
    } else {
      window.alert("Registration Successful");
      history("/login");
    }
  };

  return (
    <div>
      <form method="POST" className="signup-form">
        <div className="form-signup">
          <figure>
            <img src={sign} alt="" />
          </figure>

          <div className="form-info-signup">
            <div className="heading">
              <h2>Sign Up</h2>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="name">
                Name:
              </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="text"
                  name="name"
                  id="name"
                  value={user.name}
                  onChange={handleInputs}
                  placeholder="Enter your name..."
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="email">
                Email:
              </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleInputs}
                  placeholder="Enter your valid email id..."
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="stream">
                Stream:
              </label>
              <div className="form-input">
                <select
                  name="stream"
                  id="stream"
                  value={user.stream}
                  onChange={handleInputs}
                  className="input-style"
                  
                >
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="year">
                Year:
              </label>
              <div className="form-style">
                <select
                  name="year"
                  id="year"
                  value={user.year}
                  onChange={handleInputs}
                  className="input-style"
                  
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                </select>
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="phone">
                Phone:
              </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="number"
                  name="phone"
                  id="phone"
                  value={user.phone}
                  onChange={handleInputs}
                  placeholder="Enter your phone number..."
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="password">
                Password:
              </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="password"
                  name="password"
                  id="password"
                  value={user.password}
                  onChange={handleInputs}
                  placeholder="Enter new password..."
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="cpassword">
                Confirm Password:
              </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="password"
                  name="cpassword"
                  id="cpassword"
                  value={user.cpassword}
                  onChange={handleInputs}
                  placeholder="Enter password to confirm..."
                />
              </div>
            </div>
            <div className="form-style">
              <div className="form-style">
                <div className="form-input">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                  />
                  I accept the terms and conditions
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="submit">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  value="Register"
                  onClick={PostData}
                />
              </div>
              <div className="login-link">
                <NavLink to="/login">
                  Already Registered? <b>Login</b>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
