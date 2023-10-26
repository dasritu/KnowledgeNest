import React from "react";
import "../styles/Guest.css";
import { default as img } from "../image/3d-render-online-education-survey-test-concept.jpg";
import { default as logo } from "../image/reading.png";
import { default as contact } from "../image/5124556.jpg";
import { MdTravelExplore } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import { default as img1 } from "../image/online-learning.png";
import { default as img2 } from "../image/book-stack.png";
import { default as img3 } from "../image/notebook.png";
export default function Guest() {
  return (
    <>
      <div className="guestbody" id="home">
        <div className="hero-guest1">
          <img src={img} alt="" />
        </div>
        <div className="hero-guest2">
          <div className="text-guest">
            <div className="guest-logo">
              <img src={logo} style={{ color: "Purple" }} />
            </div>
            <h3>KnowledgeNest</h3>
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
      <div className="guest_about" id="about">
        <h1 className="guest-heading">
          <GrContactInfo />
          About US
        </h1>
        <div className="guest-about">
          <div className="firstdiv">
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
          </div>
          <div className="seconddiv">
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
          </div>
          <div className="thirddiv">
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
          </div>
        </div>
        <div class="contact-container">
          <div class="contact-image">
            <img src={contact} alt="Contact Image" />
          </div>
          <div class="guest-contact" id="contact">
            <h1 class="guest-heading">
              <GrContactInfo />
              Contact US
            </h1>

            <form action="" class="guest-form">
              <label for="name">Name: </label>
              <input type="text" id="name" class="guest-input" />
              <label for="email">Email: </label>
              <input type="email" id="email" class="guest-input" />
              <label for="message">Message:</label>
              <input type="text" id="message" class="guest-input-msg" />
              <input type="submit" class="submit-guest" value="Submit" />
            </form>
          </div>
        </div>

        <div className="guest-footer">
          <h4>Techno College Hooghly</h4>
          <br />
          <h4>A Technical & Management College Under Techno India Group</h4>
          <br />
          <h4>Affilated to MATAUT, WB formerly WBUT</h4>
        </div>
      </div>
    </>
  );
}
