import React from 'react'
import "../styles/ExamCard.css";
import {ArrowLeft, ArrowRight, Clock, Flag, Send} from 'lucide-react'
const ExamCard = (props) => {
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
                            <div className="ques-num" key={element}>
                                {element}
                            </div>
                        )
                    })
                }
           </div>
           <div className="details-container">
                <div className="details-line">
                    <div className='det-circle circle1'></div>
                    উত্তর দেওয়া হয়নি
                </div>

                <div className="details-line">
                    <div className='det-circle circle2'></div>
                    উত্তর দেওয়া হয়েছে
                </div>

                <div className="details-line">
                    <div className='det-circle circle3'></div>
                    ফ্ল্যাগ করা হয়েছে
                </div>
           </div>
           <div className="finish-exam">
                <button onClick={props.handleFinish}> <Send size={17}/>  পরীক্ষা শেষ করুন</button>
            </div>

        </div>

        <div className="question-card-container">
                <div className="question-card">
                    <div className="card-header">
                        <div className="tag-section">
                            <span>প্রশ্ন 1/7</span>
                            <div className="tag">এমসিকিউ</div>
                        </div>
                        <button className='flag'> <Flag size={15}/> ফ্ল্যাগ করুন</button>
                    </div>

                    <div className="ques-section">
                        <div className="ques">
                            <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et quam aliquid sit animi nihil esse officia quae hic quas quaerat!</h3>
                        </div>
                        <div className="option-section">
                            <div className="option">
                                <div className="option-num">
                                    1
                                </div>
                                Lorem ipsum dolor sit amet.
                            </div>

                            <div className="option">
                                <div className="option-num">
                                    2
                                </div>
                                Lorem ipsum dolor sit amet.
                            </div>

                            <div className="option">
                                <div className="option-num">
                                    3
                                </div>
                                Lorem ipsum dolor sit amet.
                            </div>

                            <div className="option">
                                <div className="option-num">
                                    4
                                </div>
                                Lorem ipsum dolor sit amet.
                            </div>

                        </div>
                    </div>
                </div>

                <div className="next-prev-ques">
                    <button className='prev-button'> <ArrowLeft size={15}/> পূর্ববর্তী প্রশ্ন</button>
                    <button className='next-button'>পরবর্তী প্রশ্ন <ArrowRight size={15}/></button>
                </div>
        </div>
    </div>
  )
}

export default ExamCard