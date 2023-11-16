import React, { useState } from "react";
import "../styles/Guest.css";
import { default as img } from "../image/3d-render-online-education-survey-test-concept-removebg-preview.png";
import { default as logo } from "../image/reading.png";
import { default as contact } from "../image/ContactUs.png";
import { MdTravelExplore } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import { default as img1 } from "../image/online-learning.png";
import { default as img2 } from "../image/book-stack.png";
import { default as img3 } from "../image/notebook.png";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Footer from "./Footer";

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(5px);
  }
  50% {
    transform: translateY(-10px);
  }
`;
const floattextanimation = keyframes`
  0%{

    color:purple;
  }
  
  50% {
    
    color:black;
    
  }
  65%{
    color:purple;
  }
  75%{
    color:black;
  }
  85%{
    color:purple;
  }

`;
const fadeInAnimation = keyframes`
0%    { opacity: 0; }
100%  { opacity: 1; }
`;

const CardContainer = styled.div`
  animation: ${fadeInAnimation} 5s infinite;
`;
const FloatingImage = styled.img`
  animation: ${floatAnimation} 2s infinite;
`;
const FloatText = styled.div`
  animation: ${floattextanimation} 3s infinite;
`;

export default function Guest() {
  const [text, setMessage] = useState({
    name: "",
    email: "",
    message: "",
  });
  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setMessage({ ...text, [name]: value });
  };
  const handleSubmit = async (e) => {
    console.log("Message")
    e.preventDefault();
    const { name, email, message } = text;

    try {
      const response = await fetch("/save-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
  
      if (response.status===200) {
        toast.success("Message submitted successfully!");
        window.alert("Message Sent Successfully");
        console.log("Message Sent");

        // Clear the form fields
        setMessage({
          name: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Error submitting message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting message");
    }
  };

  return (
    <>
      <div className="guestbody" id="home">
        <div className="hero-guest1">
          <FloatingImage src={img} alt="Floating Image" />
        </div>
        <div className="hero-guest2">
          <div className="text-guest">
            <div className="guest-logo">
              <img src={logo} style={{ color: "Purple" }} />
            </div>
            <FloatText>
              <h3>KnowledgeNest</h3>
            </FloatText>
            <p>
              Empowering Education at KnowledgeNest Unleashing the Power of
              Knowledge through Seamless Book management.
              <br />A project of MCA Student of Techno College Hooghly
            </p>
            <button
              className="guest-btn"
              style={{ color: "Purple", backgroundColor: "yellow" }}
            >
              Explore <MdTravelExplore />
            </button>
          </div>
        </div>
      </div>
      <div className="guest_about">
        <h1 className="guest-heading" id="about">
          <GrContactInfo style={{ margin: "10px" }} />
          About US
        </h1>
        <div className="guest-about">
          <CardContainer className="firstdiv">
            <div className="icon-g">
              <img src={img1} style={{ height: "75px", width: "75px" }} />
            </div>
            <div className="title">
              <b>Our Vision</b>
            </div>
            <p>
              We envision a world where education transcends boundaries, where
              every individual has the opportunity to thrive through access to
              quality learning resources. KnowledgeNest is the realization of
              this vision, a haven for academic growth and exploration.{" "}
            </p>
          </CardContainer>
          <CardContainer className="seconddiv">
            <div className="icon-g">
              <img src={img2} style={{ height: "75px", width: "75px" }} />
            </div>
            <div className="title">
              <b>Educational Empowerment</b>
            </div>
            <p>
              At the core of our identity is the belief that education is the
              key to unlocking one's true potential. We are committed to
              providing a dynamic and enriching environment where learners can
              engage with a diverse array of educational materials tailored to
              their needs.{" "}
            </p>
          </CardContainer>
          <CardContainer className="thirddiv">
            <div className="icon-g">
              <img src={img3} style={{ height: "75px", width: "75px" }} />
            </div>
            <div className="title">
              <b>User-Centric Approach</b>
            </div>
            <p>
              We understand the unique needs of our users, especially students
              navigating the challenges of academia. KnowledgeNest empowers
              users to request books relevant to their semester, ensuring that
              the learning journey is personalized and meaningful.{" "}
            </p>
          </CardContainer>
        </div>
        <div class="contact-container">
          <div class="contact-image" id="contact">
            <img className="flipped" src={contact} alt="Contact Image" />
          </div>
          <div class="guest-contact">
            <h1 class="guest-heading-contact">
              {/* <GrContactInfo /> */}
              <strong>Contact US</strong>
            </h1>

            <form method="POST" className="guest-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInputs}
                value={text.name}
                className="guest-input"
                placeholder="Enter your full name..."
              />

              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleInputs}
                value={text.email}
                className="guest-input"
                placeholder="Enter your email id ...."
              />

              <label htmlFor="message">Message:</label>
              <input
                type="text"
                id="message"
                name="message"
                onChange={handleInputs}
                value={text.message}
                className="guest-input-msg"
                placeholder="Write your Query...."
              />

              <input type="submit" className="submit-guest" value="Submit" />
            </form>
          </div>
        </div>
        <ToastContainer />
        <Footer />
      </div>
    </>
  );
}
