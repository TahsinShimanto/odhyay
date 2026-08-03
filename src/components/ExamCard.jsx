import React from 'react'
import "../styles/ExamCard.css";
import {Clock, Send} from 'lucide-react'
const ExamCard = () => {
    const arr = [1,2,3,4,5,6,7,8,9,10]
  return (
    <div className="exam-container">
        <div className="question-navigation">

           <div className="header-container">
                <span>একনজরে</span>
                <div className="timer-container">
                    <Clock size={20} color='#c0c1ff'/>
                    <span>00:00</span>
                </div>
           </div>
           <div className="navigation-container">
                {
                    arr.map( (element) => {
                        return (
                            <div className="ques-num">
                                {element}
                            </div>
                        )
                    })
                }
           </div>
           <div className="details-container">

           </div>
           <div className="finish-exam">
                <button> <Send size={17}/>  পরীক্ষা শেষ করুন</button>
            </div>

        </div>

        <div className="question-card">

        </div>
    </div>
  )
}

export default ExamCard