import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import login from "../image/login.jpg";
import "../styles/Signup.css";
import { UserContext } from "../App";
export default function Login() {
  const { state, dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("Invalid Credenetials");
    } else {
      navigate("/");
      dispatch({ type: "USER", payload: true });
      // window.alert("Login Successfull");
    }

    
  };

  return (
    <div>
      <form method="POST">
        <div className="form">
          <figure>
            <img src={login} alt="" />
          </figure>

          <div className="form-info">
            <div className="heading">Login</div>
            <div className="name"></div>
            <div className="email">
              <label htmlFor="">Email:</label>
              <div className="input">
                {" "}
                <input
                  type="email"
                  name="email"
                  id=""
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="password">
              <label htmlFor="">Password:</label>
              <div className="input">
                <input
                  type="password"
                  name="password"
                  id=""
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="bottom">
              <div className="submit">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  value="Login"
                  onClick={loginUser}
                />
              </div>
              <div className="login-link">
                <NavLink to="/signup">
                  New User? <b>Signup</b>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
