import React from "react";
import { default as img1 } from "../image/facebook.png";
import { default as img2 } from "../image/instagram.png";
import { default as img3 } from "../image/twitter.png";
import "../styles/Footer.css";
const Footer = () => {
  const footerStyle = {
    backgroundColor: "black",
    color: "white",
    padding: "20px",
  };

  const columnStyle = {
    flex: 1,
    textAlign: "center",
    padding: "20px",
  };

  const technoIndiaAddress =
    "Dharampur G. T. Road, More, near Khadina, Chinsurah R S, Chinsurah, West Bengal 712101";

  return (
    <footer style={footerStyle}>
      <div style={{ display: "flex" }} className="footer-style">
        <div style={columnStyle}>
          <h3>Terms and Conditions</h3>
          <p>📚 Extensive Resource Collection</p>
          <p>📚 Knowledgeable Staff</p>
          <p>📚 Quiet and Productive Environment</p>
          <p>📚 Access to Digital Resources</p>
          <p>📚 Interlibrary Loan Services</p>
        </div>
        <div style={columnStyle}>
          <h3>Contact Details</h3>
          <p>Email: knowledgenestsr23@gmail.com</p>
          <p>Phone: +91 7585957009</p>
          <div class="social-icons" style={{textAlign:"center"}}>
            <a href="/" className="social-icon">
              <img
                src={img1}
                alt="Facebook"
                style={{ height: "50px", width: "50px" }}
              />
            </a>
            <a href="/" className="social-icon">
              <img src={img2} alt="Twitter" style={{ height: "50px", width: "50px" }} />
            </a>
            <a href="/" className="social-icon">
              <img src={img3} alt="Instagram" style={{ height: "50px", width: "50px" }} />
            </a>
          </div>
        </div>
        <div style={columnStyle}>
          <h3>Address</h3>
          <p>{technoIndiaAddress}</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.5909619758913!2d88.38166059999999!3d22.8915638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89167529a8f17%3A0xe94a8f21ca53259a!2sTechno%20India%20(Hooghly%20Campus)!5e0!3m2!1sen!2sin!4v1698540710974!5m2!1sen!2sin"
            style={{
              width: "600",
              height: "350",
              border: 0,
              textAlign:"center",
              allowfullscreen: "",
              loading: "lazy",
              referrerpolicy: "no-referrer-when-downgrade",
            }}
          ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
