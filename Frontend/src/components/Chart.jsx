import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import '../styles/Chart.css'

const Chart = ({
  data,
  title = "পরীক্ষার ফলাফলের ধারাবাহিকতা",
  xKey = "test",
  dataKey = "score",
  xLabel = "সাম্প্রতিক পরীক্ষা",
  yLabel = "নম্বর (%)",
  domain = [0, 100],
}) => {
  return (
    <div className="chart-card">
      <p>{title}</p>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 15 }}>
            <defs>
              <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c0c1ff" />
                <stop offset="100%" stopColor="#8a8bff" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tick={{ fontSize: 11, fill: "#8a8890" }}
              label={{ value: xLabel, position: "insideBottom", offset: -10, fontSize: 13, fill: "#c0c1ff" }}
            />
            <YAxis
              domain={domain}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#8a8890" }}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 13, fill: "#c0c1ff" }}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="url(#lineStroke)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#0F0F0F", stroke: "#c0c1ff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#c0c1ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;