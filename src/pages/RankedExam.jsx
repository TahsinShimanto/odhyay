import React, { useState } from 'react'
import RankedSimulator from '../components/RankedSimulator'
import ExamCard from '../components/ExamCard'
import Result from '../components/Result'
const RankedExam = () => {

  const [stage, setStage] = useState("setup"); 

  function handleStartRank() {
    setStage("active");
  }

  function handleFinish() {
    setStage("finished");
  }

  function handleRetry() {
    setStage("setup");
  }

  return (
    <div>
      {stage === "finished" ? (
        <Result handleRetry={handleRetry} examType="ranked"/>
      ) : stage === "active" ? (
        <ExamCard handleFinish={handleFinish} examType="ranked"/>
      ) : (
        <RankedSimulator handleStartRank={handleStartRank} />
      )}
      
    </div>
  )
}

export default RankedExam
