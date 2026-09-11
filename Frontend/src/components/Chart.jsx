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

const Chart = ({data}) => {
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
