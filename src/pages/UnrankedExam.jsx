import React from "react";
import { useState } from "react";
import UnrankedSimulator from "../components/UnrankedSimulator";
import ExamCard from "../components/ExamCard";
import Result from "../components/result";

const UnrankedExam = () => {
  const [start, setStart] = useState(false);
  const [finish, setFinish] = useState(false);

  function handleStart() {
    setStart(true);
  }

  function handleFinish(){
    setFinish(true);
  }

  return (
    <div>
      {finish ? (
        <Result/>
      ) : !start ? (
          <UnrankedSimulator handleStart={handleStart} />
        ) : (
          <ExamCard handleFinish={handleFinish} />
        )}
    </div>
  );
};

export default UnrankedExam;
