import React from 'react'
import '../styles/Result.css'
import AnsCard from './AnsCard'
const Result = () => {
  return (
      <div className="result-container">
         <div className="heading">
            <h2>পরীক্ষা সম্পন্ন হয়েছে!</h2>
            <p>আপনার পরীক্ষার সংকলিত ফলাফল নিচে তুলে ধরা হলো</p>
         </div>

        <div className="mark-section">
            <div className="mark-card overall-mark">
                <h4>4.37 / 7</h4>
                <p>চূড়ান্ত নম্বর (52%)</p>
            </div>

            <div className="mark-card corrects">
                <h4>5</h4>
                <p>সঠিক উত্তর (+১)</p>
            </div>

            <div className="mark-card wrongs">
                <h4>2</h4>
                <p>ভুল উত্তর (-০.২৫)</p>
            </div>

            <div className="mark-card not-ans">
                <h4>0</h4>
                <p>উত্তর দেওয়া হয়নি</p>
            </div>

        </div>

        <div className="mark-section-2">
            <div className="main-mark">
                <p>মূল নম্বর (সঠিক - ভুল × ০.২৫):</p>
                <span>4.37</span>
            </div>
            <div className='total-mark'>
                <p>মোট অর্জিত নম্বর:</p>
                <span>4.37 / 7</span>
            </div>
        </div>
        
        <div className="ans-details">
            <p>প্রশ্নোত্তর ও বিস্তারিত ব্যাখ্যা</p>
            <AnsCard/>
        </div>

        <div className="result-nav">
            <button className='next-button'>নতুন পরীক্ষা</button>
            <button className='prev-button'>আবার চেষ্টা করুন</button>
        </div>
      </div>
    
  )
}

export default Result
