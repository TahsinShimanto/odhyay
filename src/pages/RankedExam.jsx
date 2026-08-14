import React, { useState } from 'react'
import RankedSimulator from '../components/RankedSimulator'
import ExamCard from '../components/ExamCard';

const RankedExam = () => {

  const [startRank, setStartRank] = useState(false)

  function handleStartRank(){
    setStartRank(true);
  }

  return (
    <div>
      {
        startRank?(
          <ExamCard/>
        ):
        (
          <RankedSimulator handleStartRank={handleStartRank}/>
        )
      }
      
    </div>
  )
}

export default RankedExam
