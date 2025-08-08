import React, { useState } from "react";
import "./StriveLifeClubPage.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

// Dummy Data for charts and patients
const impactData = [
  { year: "2021", Treated: 20, Supported: 12 },
  { year: "2022", Treated: 38, Supported: 16 },
  { year: "2023", Treated: 58, Supported: 24 },
  { year: "2024", Treated: 85, Supported: 39 },
];

const awaitingGraphData = {
  province: [
    { name: "Punjab", Awaiting: 15 },
    { name: "Sindh", Awaiting: 10 },
    { name: "KP", Awaiting: 6 },
    { name: "Balochistan", Awaiting: 2 },
  ],
  gender: [
    { name: "Male", Awaiting: 17 },
    { name: "Female", Awaiting: 16 },
  ],
  age: [
    { name: "0-2 yrs", Awaiting: 8 },
    { name: "3-6 yrs", Awaiting: 14 },
    { name: "7-12 yrs", Awaiting: 7 },
    { name: "13+", Awaiting: 4 },
  ],
  type: [
    { name: "Type 1", Awaiting: 13 },
    { name: "Type 2", Awaiting: 11 },
    { name: "Type 3", Awaiting: 9 },
  ],
  all: [
    { name: "Punjab, M, 0-2, Type 1", Awaiting: 4 },
    { name: "Sindh, F, 3-6, Type 2", Awaiting: 3 },
    { name: "KP, M, 7-12, Type 3", Awaiting: 2 },
    { name: "Punjab, F, 3-6, Type 2", Awaiting: 4 },
    { name: "Balochistan, M, 13+, Type 3", Awaiting: 1 },
  ],
};

const patientList = [
  {
    name: "Ahmed Khan",
    age: 2,
    province: "Punjab",
    smaType: "Type 1",
    amountRequired: 3500000,
    raised: 800000,
    urgency: "Critical",
  },
  {
    name: "Fatima Noor",
    age: 5,
    province: "Sindh",
    smaType: "Type 2",
    amountRequired: 2800000,
    raised: 900000,
    urgency: "High",
  },
  {
    name: "Bilal Hussain",
    age: 8,
    province: "KP",
    smaType: "Type 3",
    amountRequired: 2000000,
    raised: 400000,
    urgency: "Normal",
  },
  {
    name: "Sara Bashir",
    age: 1,
    province: "Punjab",
    smaType: "Type 1",
    amountRequired: 3700000,
    raised: 1200000,
    urgency: "Critical",
  },
];

const chartOptions = [
  { key: "province", label: "Province-wise" },
  { key: "age", label: "Age-wise" },
  { key: "gender", label: "Gender-wise" },
  { key: "type", label: "SMA Type-wise" },
  { key: "all", label: "Show All (Composite)" },
];

const HERO_BG =
  "https://media.istockphoto.com/id/926196952/photo/beautiful-nature-background.jpg?s=170667a&w=0&k=20&c=3CI8wa6kKzgUv09X_rQhermyjeGhaAlp9HiAe9v65rE=";
const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const YOUTUBE_EMBED = "https://www.youtube.com/embed/X6Tsqg-tNU8?autoplay=1&mute=1&loop=1&playlist=X6Tsqg-tNU8";

export default function StriveLifeClubPage() {
  const [activeTab, setActiveTab] = useState("awaiting");
  const [checkedChart, setCheckedChart] = useState("province");

  const getAwaitingChartData = () => awaitingGraphData[checkedChart] || [];

  // Helper: Urgency color
  const urgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "#e74c3c";
      case "High":
        return "#f39c12";
      default:
        return "#27ae60";
    }
  };

  return (
    <div className="slc-root">
      {/* HERO SECTION */}
      <div
        className="slc-hero"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="slc-hero-overlay" />
        <div className="slc-hero-content">
          <h1 className="slc-hero-title">STRIVE LIFE CLUB</h1>
          <div className="slc-hero-desc">
            <span>
              <b>Saving Lives</b> through collective action — join us to give children with SMA a second chance.
            </span>
          </div>
          <button className="button-73">DONATE NOW!</button>
        </div>
      </div>

      {/* HERO VIDEO */}
      <div className="slc-hero-video-overlap">
        <div className="slc-iframe-wrap">
          <iframe
            className="slc-hero-video"
            src={YOUTUBE_EMBED}
            title="Life Club Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="slc-tabs">
        <button
          className={`slc-tab-btn ${activeTab === "awaiting" ? "active" : ""}`}
          onClick={() => setActiveTab("awaiting")}
        >
          Patients Awaiting Treatment
        </button>
        <button
          className={`slc-tab-btn ${activeTab === "impact" ? "active" : ""}`}
          onClick={() => setActiveTab("impact")}
        >
          Patients Impact So Far
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="slc-tab-content">

        {activeTab === "impact" ? (
          <div className="slc-tab-impact-row">
            <div className="slc-chart-block glass-card impact-chart">
              <div className="slc-chart-title">Impact Over Years</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={impactData} margin={{ left: 8, right: 8, top: 36 }}>
                  <defs>
                    <linearGradient id="impactBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4d67ee" stopOpacity={0.9} />
                      <stop offset="90%" stopColor="#aac5fa" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="impactBar2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffe168" stopOpacity={0.93} />
                      <stop offset="90%" stopColor="#faf9b6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4eafd" />
                  <XAxis dataKey="year" tick={{ fill: "#2d3559", fontWeight: 700 }} axisLine={false} />
                  <YAxis tick={{ fill: "#455", fontWeight: 600 }} axisLine={false} />
                  <Tooltip
                    wrapperStyle={{ borderRadius: 10, boxShadow: "0 3px 10px #0001" }}
                    contentStyle={{ background: "#fff" }}
                  />
                  <Legend iconType="circle" verticalAlign="top" height={24} />
                  <Bar
                    dataKey="Treated"
                    fill="url(#impactBar)"
                    radius={[13, 13, 0, 0]}
                    maxBarSize={36}
                    label={{ position: "top", fill: "#212", fontWeight: 700, fontSize: 13 }}
                  />
                  <Bar
                    dataKey="Supported"
                    fill="url(#impactBar2)"
                    radius={[13, 13, 0, 0]}
                    maxBarSize={36}
                    label={{ position: "top", fill: "#444", fontWeight: 600, fontSize: 13 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="slc-tab-impact-details">
              <div className="slc-tab-title">
                Transforming Futures — One Child at a Time
              </div>
              <div className="slc-tab-desc">
                Over <b>100+ SMA children</b> have received lifesaving therapies through your support.<br />
                Our journey continues with every new smile we create!
              </div>
              <video
                src={SAMPLE_VIDEO}
                className="slc-tab-video"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                style={{ margin: "0 auto" }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Chart filters */}
            <div className="slc-awaiting-filters">
              <span>See graph:</span>
              {chartOptions.map((option) => (
                <label key={option.key} className="slc-checkbox-label">
                  <input
                    type="radio"
                    name="chartOption"
                    value={option.key}
                    checked={checkedChart === option.key}
                    onChange={() => setCheckedChart(option.key)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {/* Chart */}
            <div className="slc-chart-block glass-card">
              <div className="slc-chart-title">Patients Awaiting Support</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={getAwaitingChartData()} margin={{ left: 8, right: 8, top: 36 }}>
                  <defs>
                    <linearGradient id="awaitBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f6d365" stopOpacity={0.97} />
                      <stop offset="80%" stopColor="#fda085" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
                  <XAxis dataKey="name" tick={{ fill: "#313a44", fontWeight: 700 }} axisLine={false} />
                  <YAxis tick={{ fill: "#555", fontWeight: 600 }} axisLine={false} />
                  <Tooltip
                    wrapperStyle={{ borderRadius: 12, boxShadow: "0 3px 12px #0001" }}
                    contentStyle={{ background: "#fff" }}
                    cursor={{ fill: "#c3dbff1a" }}
                  />
                  <Bar
                    dataKey="Awaiting"
                    fill="url(#awaitBar)"
                    radius={[12, 12, 0, 0]}
                    maxBarSize={38}
                    label={{ position: "top", fill: "#333", fontWeight: 700, fontSize: 13 }}
                    barSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Table of patients */}
            <div className="slc-tab-title" style={{ marginTop: 28 }}>Current Patients Awaiting Treatment</div>
            <div className="slc-tab-desc" style={{ marginBottom: 18 }}>
              Every patient on this list urgently needs your help. Your donation bridges the gap between hope and healing.
            </div>
            <div className="slc-patient-table-wrap">
              <table className="slc-patient-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Province</th>
                    <th>SMA Type</th>
                    <th>Amount Needed</th>
                    <th>Raised</th>
                    <th>Progress</th>
                    <th>Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.age}</td>
                      <td>{p.province}</td>
                      <td>{p.smaType}</td>
                      <td>Rs. {p.amountRequired.toLocaleString()}</td>
                      <td>Rs. {p.raised.toLocaleString()}</td>
                      <td>
                        <div className="slc-progress-bar-wrap">
                          <div
                            className="slc-progress-bar"
                            style={{
                              width: `${Math.min((p.raised / p.amountRequired) * 100, 100)}%`,
                              background: urgencyColor(p.urgency),
                              boxShadow: `0 1px 8px ${urgencyColor(p.urgency)}33`
                            }}
                          ></div>
                        </div>
                        <span className="slc-progress-percent">
                          {Math.round((p.raised / p.amountRequired) * 100)}%
                        </span>
                      </td>
                      <td>
                        <span className="slc-urgency" style={{ color: urgencyColor(p.urgency) }}>
                          {p.urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Video */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
              <video
                src={SAMPLE_VIDEO}
                className="slc-tab-video"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                style={{ margin: "0 auto" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
