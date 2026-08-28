import React, { useEffect, useState } from "react";
import "../styles/ExamCard.css";
import { ArrowLeft, ArrowRight, Clock, Flag, Send } from "lucide-react";
import axios from "axios";
import Countdown from "react-countdown";
const ExamCard = (props) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleNext() {
    setCurrentIndex((prev) => prev + 1);
  }

  function handlePrev() {
    setCurrentIndex((prev) => prev - 1);
  }

  const [flagged, setFlagged] = useState([]);
  const [answers, setAnswers] = useState({});

  function toggleFlag(quesId) {
    if (flagged.includes(quesId)) {
      const newFlagged = flagged.filter((id) => id !== quesId);
      setFlagged(newFlagged);
    } else {
      const newFlagged = flagged.slice();
      newFlagged.push(quesId);
      setFlagged(newFlagged);
    }
  }

  function selectOption(questId, optId) {
    const newAnswers = {};
    for (const key in answers) {
      newAnswers[key] = answers[key];
    }

    newAnswers[questId] = optId;
    setAnswers(newAnswers);
  }

  const [currentTime] = useState(() => {
  const validMinutes = Number(props.minutes) || 10; 
  return Date.now() + validMinutes * 60 * 1000;
  });


  useEffect(() => {
    axios
      .get("/api/questions", { params: { count: props.quesCount } })
      .then((res) => {
        const sliced = res.data.slice(0, Number(props.quesCount) || 10);
        setQuestions(sliced);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (error) return <div className="load-error">ত্রুটি: {error}</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exam-container">
      <div className="question-navigation">
        <div className="header-container">
          <span>একনজরে</span>
          <div className="timer-container">
            <Clock size={20} color="#c0c1ff" />
            <Countdown
              date={currentTime}
              onComplete={() => props.handleFinish()}
              renderer={({ minutes, seconds }) => (
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              )}
            />
          </div>
        </div>
        <div className="navigation-container">
          {questions.map((ques, index) => {
            let status = "notAnswered";
            if (flagged.includes(ques._id)) status = "flagged";
            if (answers[ques._id] !== undefined) status = "answered";

            let activeClass = "";
            if (index === currentIndex) activeClass = "active";

            return (
              <div
                className={`ques-num ${status} ${activeClass}`}
                key={ques._id}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
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
              <span>
                প্রশ্ন {currentIndex + 1}/{questions.length}
              </span>
              <div className="tag">
                {currentQuestion.type === "mcq" ? "এমসিকিউ" : "লিখিত"}
              </div>
            </div>
            <button className={flagged.includes(currentQuestion._id) ? "active-flag":"flag"} 
            onClick={() => toggleFlag(currentQuestion._id)}>
              <Flag size={15} /> 
              {flagged.includes(currentQuestion._id) ? "ফ্ল্যাগ সরান" : "ফ্ল্যাগ করুন"}
            </button>
          </div>

          <div className="ques-section">
            <div className="ques">
              <h3>{currentQuestion.questionText}</h3>
              {currentQuestion.questionImage ? (
                <img src={currentQuestion.questionImage} />
              ) : null}
            </div>
            <div className="option-section">
              {currentQuestion.type === "mcq" ? (
                currentQuestion.options?.map((opt, index) => (
                  <div className="option" key={opt.id}>
                    <div className="option-num">{index + 1}</div>
                    {opt.text}
                    {opt.image ? <img src={opt.image} alt="" /> : null}
                  </div>
                ))
              ) : (
                <div className="written-answer-section">
                  <textarea placeholder="তোমার উত্তর লিখো..." />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="next-prev-ques">
          <button
            className="prev-button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={15} /> পূর্ববর্তী প্রশ্ন
          </button>

          <button
            className="next-button"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            পরবর্তী প্রশ্ন <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
