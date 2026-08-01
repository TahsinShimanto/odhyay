import React from "react";
import "../styles/UnrankedSimulator.css";
import { Award, Play } from "lucide-react";
const UnrankedSimulator = () => {
  return (
    <div className="simulator-container">
      <div className="simulator-heading">
        <h3>
          <Award size={20} /> What do you want to practice?
        </h3>
        <p>
          Build your own practice test. See your speed, mark hard questions, and
          check full answers when you're done.
        </p>
      </div>
      <div className="simulator-card">
        <div className="steps">
          <div className="step-heading">
            <p>STEP 1 • WHAT TO PRACTICE</p>
          </div>
          <div className="step-inputs">
            <div className="input-line">
              <div className="input-container">
                <label htmlFor="exam">EXAM</label>
                <select id="exam">
                  <option>Exam 1</option>
                  <option>Exam 2</option>
                  <option>Exam 3</option>
                </select>
              </div>

              <div className="input-container">
                <label htmlFor="subject">SUBJECT</label>
                <select id="subject">
                  <option>Subject 1</option>
                  <option>Subject 2</option>
                  <option>Subject 3</option>
                </select>
              </div>
            </div>

            <div className="input-line">
              <div className="input-container">
                <label htmlFor="chapter">CHAPTER</label>
                <select id="chapter">
                  <option>Chapter 1</option>
                  <option>Chapter 2</option>
                  <option>Chapter 3</option>
                </select>
              </div>

              <div className="input-container">
                <label htmlFor="topic">TOPIC</label>
                <select id="topic">
                  <option>Topic 1</option>
                  <option>Topic 2</option>
                  <option>Topic 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="steps">
          <div className="step-heading">
            <p>STEP 2 • TEST SETTINGS</p>
          </div>

            <div className="quantity-container">
                 <p>How many questions?</p>
               
            </div>

            <div className="quantity-container">
               <p>Set Timer</p>
            </div>

            <button className="start-button"> 
                <Play size={20} />
                START TEST
            </button>
        </div>

      </div>
    </div>
  );
};

export default UnrankedSimulator;
