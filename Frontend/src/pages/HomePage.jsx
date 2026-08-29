import React from "react";
import "../styles/HomePage.css";
import {
  Pen,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Layers,
  ClipboardList,
  Lightbulb,
  BarChart,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";
const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="hero-card">
        <div className="left">
          <div className="hero-badge">
            <Pen size={15} />
            শেখার নতুন অভিজ্ঞতা
          </div>

          <div className="hero-description">
            <p id="hero-heading">প্রশ্ন অনুশীলন করুন, নিজেকে যাচাই করুন </p>
            <span>
              বিষয় ও অধ্যায় বেছে নিয়ে প্রশ্ন সমাধান করুন। সঙ্গে সঙ্গে উত্তর ও ব্যাখ্যা দেখুন এবং আপনার অগ্রগতি ধরে রাখুন।
              {" "}
            </span>
          </div>

          <div className="hero-page-links">
            <NavLink to={"/questionsolving"} className="solve-question">
              প্রশ্ন সমাধান করুন
            </NavLink>

            <NavLink to={"/unrankedexam"} className="custom-exam">
              নিজের পরীক্ষা তৈরি করুন
            </NavLink>

            <NavLink to={"/"} className="sign-in">
              স্ট্রিক দেখতে সাইন ইন করুন
              <ArrowRight size={15} />
            </NavLink>
          </div>
        </div>

        <div className="right">
          <BookOpen size={400} color="#272727" />
        </div>
      </div>

      <div className="modules-container">
        <div className="module-header">
          <Layers size={18} color="#c0c1ff" />
          অনুশীলনের মডিউল (৩টি)
        </div>
        <div className="module-cards">

          <div className="card-module">
            <p>বিষয়</p>
            <p className="card-title">ইঞ্জিনিয়ারিং প্রস্তুতি</p>
            <p>৩টি বিষয় · ৫০০+ প্রশ্ন</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              অনুশীলন শুরু করুন
              <ArrowRight size={12} />
            </NavLink>
          </div>

          <div className="card-module">
            <p>বিষয়</p>
            <p className="card-title">ভার্সিটি প্রস্তুতি</p>
            <p>৬টি বিষয় · ১০০০+ প্রশ্ন</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              অনুশীলন শুরু করুন
              <ArrowRight size={12} />
            </NavLink>
          </div>

          <div className="card-module">
            <p>বিষয়</p>
            <p className="card-title">মেডিকেল প্রস্তুতি</p>
            <p>৩টি বিষয় · ৬০০+ প্রশ্ন</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              অনুশীলন শুরু করুন
              <ArrowRight size={12} />
            </NavLink>
          </div>

        </div>
      </div>

      <div className="modules-container">
        <div className="module-header">
          <Sparkles size={18} color="#c0c1ff" />
          যেভাবে কাজ করে 
        </div>

        <div className="module-cards">

          <div className="card-module">
            <div className="card-icons">
              <ClipboardList size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">ধাপ ০১</p>
            <p className="instruction-text">অধ্যায় বেছে নিন</p>
            <p className="instruction-description">প্রশ্নব্যাংক থেকে বিষয়, অধ্যায় বা টপিক বেছে নিন।</p>
          </div>

          <div className="card-module">
            <div className="card-icons">
              <Lightbulb size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">ধাপ ০২</p>
            <p className="instruction-text">সমাধান করুন, শিখুন</p>
            <p className="instruction-description">প্রশ্নের উত্তর দিন এবং সঙ্গে সঙ্গে ব্যাখ্যা দেখুন।</p>
          </div>

          <div className="card-module">
            <div className="card-icons">
              <BarChart size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">ধাপ ০৩</p>
            <p className="instruction-text">আপনার স্ট্রিক দেখুন</p>
            <p className="instruction-description">সময়ের সঙ্গে আপনার সঠিক উত্তরের হার, অবস্থান ও অগ্রগতি দেখুন।</p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;
