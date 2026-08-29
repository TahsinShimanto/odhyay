import React from 'react'
import '../styles/ProgressCard.css'

const subjects = [
  { name: "পদার্থবিজ্ঞান", progress: 75, attempts: 3 },
  { name: "রসায়ন", progress: 55, attempts: 2 },
  { name: "জীববিজ্ঞান", progress: 40, attempts: 2},
  { name: "উচ্চতর গণিত", progress: 15, attempts: 1},
  { name: "ইংরেজি", progress: 90, attempts: 4},
];


const ProgressCard = () => {
  return (
    <div className='progress-card-container'>
      <p id='card-heading'>বিষয়ভিত্তিক অগ্রগতি</p>
      <div className="subject-list">
        {
            subjects.map((elem) => (
                <div className="subject-list-item" key={elem.name}>
                    <div className="subject-header">
                        <p>{elem.name}</p>
                        <p>{elem.progress}%</p>
                    </div>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${elem.progress}%`}}></div>
                    </div>

                    <p id='attempt-text'>অংশগ্রহণ: {elem.attempts}</p>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default ProgressCard
