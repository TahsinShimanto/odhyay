import React from 'react'
import '../styles/AnsCard.css'
const AnsCard = () => {
  return (
    <div className='ans-card'>
      <div className="header">
        প্রশ্ন 1
        <div className="ans-tag">
            সঠিক
        </div>
      </div>

      <div className="divider"></div>

      <div className="ques-section">
        <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum, maiores.</h3>
        <div className="explain-card">
            <div className="user-ans">
                আপনার উত্তর:
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="correct-ans">
                সঠিক উত্তর:
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="divider"></div>
            <div className="detailed-explain">
                বিস্তারিত ব্যাখ্যা:
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus dicta veritatis deserunt voluptate velit eius consectetur voluptatem similique illo laudantium.</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AnsCard
