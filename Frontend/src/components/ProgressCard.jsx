import '../styles/ProgressCard.css'

const ProgressCard = ({ subjects, title = "বিষয়ভিত্তিক অগ্রগতি (মডেল টেস্ট)", detailLabel = "অংশগ্রহণ" }) => {
  return (
    <div className='progress-card-container'>
      <p id='card-heading'>{title}</p>
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

                    <p id='attempt-text'>{detailLabel}: {elem.detail}</p>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default ProgressCard
