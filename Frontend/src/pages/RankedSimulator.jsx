import "../styles/RankedSimulator.css";
import {
  BarChart3,
  LucideSwatchBook,
  School,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../services/axios.js";

const RankedSimulator = () => {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [formError, setFormError] = useState("");

  const [selectedExamType, setSelectedExamType] = useState("Engineering");

  function handleSelectExamType(examType) {
    setSelectedExamType(examType);
  }

  async function handleStartRank() {
    if (!selectedExamType) {
      setFormError("পরীক্ষার বিভাগ নির্বাচন করুন");
      return;
    }
    setFormError("");

    try {
      const res = await axios.post("/api/exam/start", {
        type: "ranked",
        questionCount: 10,
        minutes: 10,
        module: selectedExamType || undefined,
      });

      navigate(`/exam/ranked/${res.data.attemptId}`);
    } catch (err) {
      setFormError(err.response?.data?.error || "পরীক্ষা শুরু করা যায়নি");
    }
  }

  useEffect(() => {
    axios
      .get("/api/exam/leaderboard", {
        params: { module: selectedExamType || undefined },
      })
      .then((res) => setLeaderboard(res.data.leaderboard))
      .catch(() => {});

    axios
      .get("/api/exam/my-stats", {
        params: { module: selectedExamType || undefined },
      })
      .then((res) => {
        setBestScore(res.data.bestScore);
        setCompletedCount(res.data.completedCount);
      })
      .catch(() => {});
  }, [selectedExamType]);

  return (
    <div>
      <div className="ranked-simulator-container">
        <div className="rank-header-container">
          <div className="ranked-heading">
            <h3>
              {" "}
              <BarChart3 /> প্রস্তুতি যাচাই পরীক্ষা
            </h3>
            <p>
              নির্দিষ্ট সময়সীমায় নিজের মেধা যাচাই করুন এবং লিডারবোর্ডে শীর্ষে
              থাকার প্রতিযোগিতা করুন।
            </p>
          </div>

          <div className="rank-header-card">
            <div className="rank-header-card-item">
              <p>সর্বোত্তম নম্বর</p>
              <p className="r-h-c-v">{bestScore}</p>
            </div>
            <div className="vertical-divider"></div>
            <div className="rank-header-card-item">
              <p>সম্পন্ন পরীক্ষা</p>
              <p className="r-h-c-v">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="ranked-cards-section">
          <div className="exam-start-card">
            <p>
              <LucideSwatchBook size={15} /> পরীক্ষার বিভাগ নির্ধারণ করুন
            </p>
            <div className="divider"></div>
            <div className="selection-card-container">
              <div
                className={
                  selectedExamType === "Engineering"
                    ? "selection-card c1 active"
                    : "selection-card c1"
                }
                onClick={() => handleSelectExamType("Engineering")}
              >
                <Settings size={23} color="#c0c1ff" />
                <div className="sel-card-text-sec">
                  <h5>ইঞ্জিনিয়ারিং প্রস্তুতি</h5>
                  <p>BUET, CUET, KUET, RUET</p>
                </div>
              </div>
              <div
                className={
                  selectedExamType === "Medical"
                    ? "selection-card c1 active"
                    : "selection-card c1"
                }
                onClick={() => handleSelectExamType("Medical")}
              >
                <Stethoscope size={23} color="#c0c1ff" />
                <div className="sel-card-text-sec">
                  <h5>মেডিকেল প্রস্তুতি</h5>
                  <p>MBBS, BDS ভর্তি পরীক্ষা</p>
                </div>
              </div>
              <div
                className={
                  selectedExamType === "Varsity"
                    ? "selection-card c1 active"
                    : "selection-card c1"
                }
                onClick={() => handleSelectExamType("Varsity")}
              >
                <School size={23} color="#c0c1ff" />
                <div className="sel-card-text-sec">
                  <h5>ভার্সিটি প্রস্তুতি</h5>
                  <p>ঢাবি ক/খ/গ ইউনিট ও অন্যান্য</p>
                </div>
              </div>
            </div>

            <div className="selection-card c2">
              <p>
                পরীক্ষা শুরু হলে নির্ধারিত সময়ের মধ্যে সব উত্তর প্রদান করতে হবে।
                সময় শেষ হলে স্বয়ংক্রিয়ভাবে উত্তরপত্র জমা হয়ে যাবে।
              </p>
            </div>
            {formError && <span className="form-error">{formError}</span>}
            <button onClick={handleStartRank} className="start-button">
              পরীক্ষায় অংশ নিন
            </button>
          </div>
          <div className="leaderboard-card">
            <p>
              <Users size={15} /> গ্লোবাল লিডারবোর্ড ({selectedExamType})
            </p>
            <div className="top-names">
              {leaderboard.map((entry, index) => (
                <div className="name-card" key={index}>
                  <div className="name-rank">
                    <span>#{index + 1}</span>
                    <p>{entry.displayName}</p>
                  </div>
                  <div className="percentage">{entry.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RankedSimulator;
