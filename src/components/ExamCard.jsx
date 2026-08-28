import React, { useEffect, useState } from "react";
import "../styles/ExamCard.css";
import { ArrowLeft, ArrowRight, Clock, Flag, Send } from "lucide-react";
import axios from "axios";
const ExamCard = (props) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const arr = [1,2,3,4,5,6,7,8,9,10];
  useEffect(() =>{
    axios.get("/api/questions")
    .then((res) => {
        setQuestions(res.data);
        setLoading(false);
    })
    .catch((err) => {
        setError(err.message);
        setLoading(false);
    })
  }, []);

  if (loading) return (<div className="exam-container">লোড হচ্ছে...</div>);
  if (error) return (<div className="exam-container">ত্রুটি: {error}</div>);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exam-container">
      <div className="question-navigation">
        <div className="header-container">
          <span>একনজরে</span>
          <div className="timer-container">
            <Clock size={20} color="#c0c1ff" />
            <span>00:00</span>
          </div>
        </div>
        <div className="navigation-container">
          {arr.map((element) => {
            return (
              <div className="ques-num" key={element}>
                {element}
              </div>
            );
          })}
        </div>
        <div className="details-container">
          <div className="details-line">
            <div className="det-circle circle1"></div>
            উত্তর দেওয়া হয়নি
          </div>

          <div className="details-line">
            <div className="det-circle circle2"></div>
            উত্তর দেওয়া হয়েছে
          </div>

          <div className="details-line">
            <div className="det-circle circle3"></div>
            ফ্ল্যাগ করা হয়েছে
          </div>
        </div>
        <div className="finish-exam">
          <button onClick={props.handleFinish}>
            {" "}
            <Send size={17} /> পরীক্ষা শেষ করুন
          </button>
        </div>
      </div>

      <div className="question-card-container">
        <div className="question-cardd">
          <div className="card-header">
            <div className="tag-section">
              <span>প্রশ্ন {currentIndex + 1}/7</span>
              <div className="tag">{currentQuestion.type === "mcq" ? "এমসিকিউ": "লিখিত"}</div>
            </div>
            <button className="flag">
              <Flag size={15} /> ফ্ল্যাগ করুন
            </button>
          </div>

          <div className="ques-section">
            <div className="ques">
              <h3>{currentQuestion.questionText}</h3>
              {currentQuestion.questionImage? (<img src={currentQuestion.questionImage}/>) : null}
            </div>
            <div className="option-section">
                
              {
                currentQuestion.options.map((opt, index) =>(
                    <div className="option" key={opt.id}>
                        <div className="option-num">{index + 1}</div>
                        {opt.text}
                        {opt.image ? (<img src={opt.image} alt="" />) : null}
                    </div>
                ))
              }

            </div>
          </div>
        </div>

        <div className="next-prev-ques">
          <button className="prev-button">
            {" "}
            <ArrowLeft size={15} /> পূর্ববর্তী প্রশ্ন
          </button>
          <button className="next-button">
            পরবর্তী প্রশ্ন <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
