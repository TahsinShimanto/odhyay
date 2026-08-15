import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import '../styles/Chart.css'
const data = [
  { test: "1", score: 30 },
  { test: "2", score: 45 },
  { test: "3", score: 50 },
  { test: "4", score: 65 },
  { test: "5", score: 60 },
  { test: "6", score: 75 },
];

const Chart = () => {
  return (
    <div className="chart-card">
      <p>পরীক্ষার ফলাফলের ধারাবাহিকতা</p>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top: 20,right: 20,bottom: 40,left: 20,}}>

            <XAxis dataKey="test" tickLine={false} tick={{ fontSize: 11 }} label={{ value: "সময় (দিন)", position: "insideBottom", offset: -10, fontSize: 13}}/>
            <YAxis  domain={[0, 100]} tickLine={false} tick={{ fontSize: 11 }} label={{ value: "নম্বর (%)", angle: -90, position: "insideLeft", fontSize: 13}}/>

            <Line type="linear" dataKey="score" stroke="#fff"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
