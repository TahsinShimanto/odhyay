import React from 'react'
import { useState } from 'react';
import UnrankedSimulator from '../components/UnrankedSimulator'
import ExamCard from '../components/ExamCard';

const UnrankedExam = () => {
  const [start, setStart] = useState(false);

  function handleStart() {
    setStart(true);
  }

  return (
    <div>
      {!start? (
        <UnrankedSimulator setStart={setStart} />
      ) : (
        <ExamCard />
      )}
    </div>
  )
}

export default UnrankedExam
