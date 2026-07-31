import React from "react";
import "../styles/HomePage.css";
import { Pen, BookOpen, ArrowBigRight, ArrowLeft, ArrowRight } from "lucide-react";
import {NavLink} from 'react-router'
const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="hero-card">
        <div className="left">
          <div className="hero-badge">
            <Pen size={15} />
            Lorem ipsum dolor kit
          </div>

          <div className="hero-description">
            <p id="hero-heading">Lorem ipsum dolor sit amet </p>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            ipsum laudantium tempora quas ad vero consectetur blanditiis ullam,
            officiis deserunt laudantium tempora quas ad vero </span>
          </div>

          <div className="hero-page-links">
            <NavLink
              to={"/questionsolving"}
              className='solve-question'
            >

              SOLVE QUESTIONS
            </NavLink>

            <NavLink
              to={"/unrankedexam"}
              className='custom-exam'
            >
              
              CUSTOM EXAMS
            </NavLink>

            <NavLink to={"/"} className='sign-in'>
              
              SIGN IN TO TRACK STREAK
              <ArrowRight size={15}/>
            </NavLink>
          </div>
        </div>

        <div className="right">
          <BookOpen size={400} color="#272727" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
