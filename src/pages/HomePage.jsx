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
            Lorem ipsum dolor kit
          </div>

          <div className="hero-description">
            <p id="hero-heading">Lorem ipsum dolor sit amet </p>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              ipsum laudantium tempora quas ad vero consectetur blanditiis
              ullam, officiis deserunt laudantium tempora quas ad vero{" "}
            </span>
          </div>

          <div className="hero-page-links">
            <NavLink to={"/questionsolving"} className="solve-question">
              SOLVE QUESTIONS
            </NavLink>

            <NavLink to={"/unrankedexam"} className="custom-exam">
              CUSTOM EXAMS
            </NavLink>

            <NavLink to={"/"} className="sign-in">
              SIGN IN TO TRACK STREAK
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
          AVAILABLE MODULES (3)
        </div>
        <div className="module-cards">

          <div className="card-module">
            <p>LOREM</p>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>LOREM LOREM</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              ENTER PRACTICE
              <ArrowRight size={12} />
            </NavLink>
          </div>

          <div className="card-module">
            <p>LOREM</p>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>LOREM LOREM</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              ENTER PRACTICE
              <ArrowRight size={12} />
            </NavLink>
          </div>

          <div className="card-module">
            <p>LOREM</p>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>LOREM LOREM</p>
            <NavLink to={"/unrankedexam"} className="enter-practice">
              ENTER PRACTICE
              <ArrowRight size={12} />
            </NavLink>
          </div>

        </div>
      </div>

      <div className="modules-container">
        <div className="module-header">
          <Sparkles size={18} color="#c0c1ff" />
          HOW IT WORKS 
        </div>

        <div className="module-cards">

          <div className="card-module">
            <div className="card-icons">
              <ClipboardList size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">Step 01</p>
            <p className="instruction-text">Pick a chapter</p>
            <p className="instruction-description">Choose a subject, chapter, or topic from the question bank.</p>
          </div>

          <div className="card-module">
            <div className="card-icons">
              <Lightbulb size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">Step 02</p>
            <p className="instruction-text">Solve with feedback</p>
            <p className="instruction-description">Answer questions and reveal explanations instantly.</p>
          </div>

          <div className="card-module">
            <div className="card-icons">
              <BarChart size={18} color="#c0c1ff"/>
            </div>
            
            <p className="step-text">Step 03</p>
            <p className="instruction-text">Track your streak</p>
            <p className="instruction-description">See your accuracy, rank, and progress over time.</p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;
