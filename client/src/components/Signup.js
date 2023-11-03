import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sign from "../image/signup.jpg";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/Signup.css";
export default function Signup() {
  const [verified, setVerified] = useState(false);

  function onChange(value) {
    console.log("Captcha value:", value);
    setVerified(true);
  }

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

  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };
  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, stream, year, phone, password, cpassword } = user;

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
      window.alert("Registration Successfull");
      history("/login");
    }
  };
  return (
    <div>
      <form method="POST" class="signup-form">
        <div className="form-signup">
          <figure>
            <img src={sign} alt="" />
          </figure>

          <div className="form-info-signup">
            <div className="heading">
              <h2>Sign Up</h2>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Name: </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="text"
                  name="name"
                  id=""
                  value={user.name}
                  onChange={handleInputs}
                  placeholder="Enter your name..."
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Email: </label>
              <div className="form-input">
                {" "}
                <input
                  className="input-style"
                  type="email"
                  name="email"
                  id=""
                  value={user.email}
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Stream: </label>
              <div className="form-input">
                <select
                  name="stream"
                  id="stream"
                  value={user.stream}
                  onChange={handleInputs}
                  className="form-input"
                  style={{ width: "200px" }}
                >
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Year:</label>
              <div className="form-input">
                <select
                  name="year"
                  id="year"
                  value={user.year}
                  onChange={handleInputs}
                  className="form-input"
                  style={{ width: "200px" }}
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                </select>
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Phone:</label>
              <div className="form-input">
                {" "}
                <input
                  className="input-style"
                  type="number"
                  name="phone"
                  id=""
                  value={user.phone}
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Password: </label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="password"
                  name="password"
                  id=""
                  value={user.password}
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="form-style">
              <label className="label-style" htmlFor="">Confirm Password:</label>
              <div className="form-input">
                <input
                  className="input-style"
                  type="password"
                  name="cpassword"
                  id=""
                  value={user.cpassword}
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="form-style">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={onChange}
                style={{ height:"40px"}}
              />
            </div>
            <div className="bottom">
              <div className="submit">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  value="Register"
                  disabled={!verified}
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
