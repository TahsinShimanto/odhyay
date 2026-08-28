import React from "react";
import { useState } from "react";
import UnrankedSimulator from "../components/UnrankedSimulator";
import ExamCard from "../components/ExamCard.jsx";
import Result from "../components/Result.jsx";

const UnrankedExam = () => {
  const [stage, setStage] = useState("setup");

  function handleStart() {
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
        <Result handleRetry={handleRetry} examType="unranked" />
      ) : stage === "active" ? (
        <ExamCard handleFinish={handleFinish} examType="unranked" />
      ) : (
        <UnrankedSimulator handleStart={handleStart} />
      )}

    </div>
  );
};

export default UnrankedExam;
