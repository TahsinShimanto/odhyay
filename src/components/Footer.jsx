import React from "react";
import "../styles/Footer.css";
import { NavLink } from "react-router";
import { Mail } from "lucide-react";
import { FaFacebook, FaGithub, FaMailchimp, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="footer-container">
      <div className="content-container">
        <section>
          <div className="vertical-line"></div>
          <div className="about-app-container">
          <p className="app-logo">অধ্যায়.</p>
          <p className="app-description">
            প্রশ্নব্যাংক, মডেল টেস্ট আর প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতি, সব একসাথে।
          </p>
        </div>
        </section>

        <div className="platform-link-container">
          <p className="platform-title">প্ল্যাটফর্ম</p>
          <NavLink to={"/questionsolving"} className="footer-link">
            প্রশ্ন সমাধান
          </NavLink>

          <NavLink to={"/savedquestions"} className="footer-link">
            সংরক্ষিত প্রশ্ন
          </NavLink>

          <NavLink to={"/rankedexam"} className="footer-link">
            প্রতিযোগীতামূলক পরীক্ষা
          </NavLink>
        </div>

        <div className="support-container">
          <p className="platform-title">সহায়তা</p>
          <p className="support-link">যোগাযোগ</p>
          <p className="support-link">সাধারণ জিজ্ঞাসা</p>
        </div>
      </div>

      <div className="social-conatiner">
        <p className="platform-title">আমাদের সঙ্গে যুক্ত থাকুন</p>
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
        <div>© ২০২৬ অধ্যায়। সর্বস্বত্ব সংরক্ষিত।</div>
        <div>শিক্ষার্থীদের জন্য, শিক্ষার্থীদের হাতেই তৈরি</div>
      </div>
    </div>
  );
};

export default Footer;
