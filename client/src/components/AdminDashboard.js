import React, { Component } from "react";
import "../styles/AdminDashboard.css";
import { FaUserGraduate } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";

export class AdminDashboard extends Component {
  render() {
    return (
      <>
        <div className="container">
          <div className="first">
            <div className="stream">
              <div className="item">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <FaUserGraduate />
                      <h1>BBA</h1>
                      <h4>426</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>
                        The BBA department offers a comprehensive business
                        education, preparing students for leadership roles.
                        Courses cover management, marketing, finance, and more,
                        fostering critical thinking and professional skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stream">
              <div className="item">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <FaUserGraduate />
                      <h1>BCA</h1>
                      <h4>369</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>
                        The BCA department offers a comprehensive curriculum in
                        computer applications, equipping students with
                        programming, database management, and IT skills for a
                        dynamic career in technology.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stream">
              <div className="item">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <FaUserGraduate />
                      <h1>MCA</h1>
                      <h4>120</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>
                        The MCA department fosters expertise in software
                        development, databases, algorithms, and system design.
                        Equipping students with computational skills for diverse
                        career paths.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stream">
              <div className="item">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <FaUserGraduate />
                      <h1>M.Sc.</h1>
                      <h4>12</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>
                        The M.Sc. department fosters expertise in software
                        development, databases, algorithms, and system design.
                        Equipping students with computational skills for diverse
                        career paths.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stream">
              <div className="item">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <FaChalkboardTeacher />
                      <h1>Faculty</h1>
                      <h4>32</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>
                        The Faculty of Techno College Hooghly is a dynamic
                        educational institution, offering cutting-edge programs,
                        skilled faculty, and a commitment to academic excellence
                        in Hooghly, West Bengal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="second">
            <h1>World</h1>
          </div>
        </div>
      </>
    );
  }
}

export default AdminDashboard;
