import React from "react";
import "../styles/Footer.css";
import { NavLink } from "react-router";
import { Mail } from "lucide-react";
import { FaFacebook, FaGithub, FaMailchimp, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="footer-container">
      <div className="content-container">
        <div className="about-app-container">
          <p className="app-logo">অধ্যায়.</p>
          <p className="app-description">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus,
            tenetur.
          </p>
        </div>

        <div className="platform-link-container">
          <p className="platform-title">PLATFORM</p>
          <NavLink to={"/questionsolving"} className="footer-link">
            QUESTION SOLVING
          </NavLink>

          <NavLink to={"/savedquestions"} className="footer-link">
            SAVED QUESTION
          </NavLink>

          <NavLink to={"/rankedexam"} className="footer-link">
            RANKED EXAM
          </NavLink>
        </div>

        <div className="support-container">
          <p className="platform-title">SUPPORT</p>
          <p className="support-link">CONTACT</p>
          <p className="support-link">FAQ</p>
        </div>
      </div>

      <div className="social-conatiner">
        <p className="platform-title">CONNECT</p>
        <div className="social-links">
          <a href="https://www.facebook.com">
            <FaFacebook size={33}/>
          </a>
          <a href="https://www.github.com">
            <FaGithub size={33}/>
          </a>

          <a href="https://www.youtube.com">
            <FaYoutube size={36}/>
          </a>
        </div>
      </div>

      <div className="copyright-container">
        <div>© 2026 Odhyay. All rights reserved.</div>
        <div>Built for students, by students</div>
      </div>
    </div>
  );
};

export default Footer;
