import "../styles/AdminDashboard.css";
import { BookOpen, Users, Layers, BookMarked } from "lucide-react";
import Chart from "../components/Chart.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import axios from "../services/axios.js";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  useEffect(() => {
    axios
      .get("/api/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get("/api/dashboard/student-growth")
      .then((res) => setGrowth(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get("/api/dashboard/module-subjects")
      .then((res) => {
        setModuleData(res.data);
        if (res.data.length > 0) setSelectedModuleId(res.data[0].moduleId);
      })
      .catch(() => {});
  }, []);

  const chartData = growth.map((point) => ({
    day: `${point.day}/${point.month}`, 
    total: point.totalStudents,
  }));
  const maxStudents = chartData.length
    ? Math.max(...chartData.map((p) => p.total))
    : 100;

  const activeModule = moduleData.find(
    (mod) => mod.moduleId === selectedModuleId,
  );
  const subjects = activeModule ? activeModule.subjects : [];
  const maxCount = subjects.length
    ? Math.max(...subjects.map((s) => s.questionCount))
    : 0;

  const progressData = subjects.map((s) => ({
    name: s.name,
    progress: maxCount > 0 ? Math.round((s.questionCount / maxCount) * 100) : 0,
    attempts: s.questionCount,
  }));

  return (
    <div className="admin-dashboard-container">
      <div className="metric-card-grid">
        <div className="metric-card">
          <div className="metric-card-heading">
            <p>মোট প্রশ্ন</p>
            <BookOpen size={16} color="#8a8890" />
          </div>
          <h3>{stats ? stats.totalQuestions : 0}</h3>
        </div>
        <div className="metric-card">
          <div className="metric-card-heading">
            <p>মোট শিক্ষার্থী</p>
            <Users size={16} color="#8a8890" />
          </div>
          <h3>{stats ? stats.totalStudents : 0}</h3>
        </div>
        <div className="metric-card">
          <div className="metric-card-heading">
            <p>মডিউল</p>
            <Layers size={16} color="#8a8890" />
          </div>
          <h3>{stats ? stats.totalModules : 0}</h3>
        </div>
        <div className="metric-card">
          <div className="metric-card-heading">
            <p>বিষয়</p>
            <BookMarked size={16} color="#8a8890" />
          </div>
          <h3>{stats ? stats.totalSubjects : 0}</h3>
        </div>
      </div>

      <div className="chart-module-section">
        <div className="chart-section">
          <Chart
            data={chartData}
            title="শিক্ষার্থী বৃদ্ধি (দৈনিক)"
            xKey="day"
            dataKey="total"
            xLabel="তারিখ"
            yLabel="শিক্ষার্থী"
            domain={[0, Math.ceil(maxStudents * 1.1)]}
          />
        </div>

        <div className="module-overview-card">
          <div className="admin-module-tabs">
            {moduleData.map((mod) => (
              <button
                key={mod.moduleId}
                type="button"
                className={
                  selectedModuleId === mod.moduleId
                    ? "admin-module-tab active"
                    : "admin-module-tab not-active"
                }
                onClick={() => setSelectedModuleId(mod.moduleId)}
              >
                {mod.moduleName}
              </button>
            ))}
          </div>
          <div className="divider"></div>
          <ProgressCard
            subjects={progressData}
            title="মডিউল অনুযায়ী বিষয় ও প্রশ্ন সংখ্যা"
            detailLabel="প্রশ্ন সংখ্যা"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
