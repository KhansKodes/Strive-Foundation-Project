import React, { useState } from "react";
import "./StriveLifeClubPage.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const HERO_BG = "https://media.istockphoto.com/id/926196952/photo/beautiful-nature-background.jpg?s=170667a&w=0&k=20&c=3CI8wa6kKzgUv09X_rQhermyjeGhaAlp9HiAe9v65rE=";
const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

const impactData = [
  { name: '2021', Treated: 20, Supported: 12 },
  { name: '2022', Treated: 38, Supported: 16 },
  { name: '2023', Treated: 58, Supported: 24 },
  { name: '2024', Treated: 85, Supported: 39 }
];

const awaitingData = [
  { name: 'Punjab', Awaiting: 15 },
  { name: 'Sindh', Awaiting: 10 },
  { name: 'KP', Awaiting: 6 },
  { name: 'Balochistan', Awaiting: 2 },
];

export default function StriveLifeClubPage() {
  const [activeTab, setActiveTab] = useState("impact");

  return (
    <div className="slc-root">
      {/* HERO SECTION */}
      <div
        className="slc-hero"
        style={{
          backgroundImage: `url(${HERO_BG})`,
        }}
      >
        <div className="slc-hero-overlay"></div>
        <div className="slc-hero-content">
          <div className="slc-hero-title-row">
            <span className="slc-hero-icon">❤️</span>
            <h1 className="slc-hero-title">STRIVE LIFE CLUB</h1>
          </div>
          <div className="slc-hero-subtitle">
            eridicating spinal muscular atrophy in pakistan
          </div>
          <button className="button-73">DONATE NOW!</button>
          <br />
          <div className="slc-hero-desc">
            <strong>What We Provide</strong><br />
            Outline the full treatment package: medication, repeated cycles, diagnostics, follow-up.
          </div>
        </div>
      </div>

      {/* OVERLAPPING VIDEO SECTION */}
      <div className="slc-hero-video-overlap">
        <div className="slc-iframe-wrap">
          <iframe
            className="slc-hero-video"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/X6Tsqg-tNU8?autoplay=1&mute=1&loop=1&playlist=X6Tsqg-tNU8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="slc-tabs">
        <button
          className={`slc-tab-btn ${activeTab === "impact" ? "active" : ""}`}
          onClick={() => setActiveTab("impact")}
        >
          Impact So Far
        </button>
        <button
          className={`slc-tab-btn ${activeTab === "awaiting" ? "active" : ""}`}
          onClick={() => setActiveTab("awaiting")}
        >
          Patients Awaiting Treatment
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="slc-tab-content">
        {activeTab === "impact" ? (
          <div className="slc-tab-impact">
            <div className="slc-chart-block">
              <div className="slc-chart-title">Impact Chart</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={impactData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Treated" fill="#8884d8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Supported" fill="#edff3a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="slc-tab-desc">
              Through Life Club, we've helped over <b>100+ SMA children</b> receive life-saving treatment.
              Ongoing support provides medication cycles, diagnostic follow-up, and family education.
            </div>
            <video
              src={SAMPLE_VIDEO}
              className="slc-tab-video"
              autoPlay
              loop
              muted
              playsInline
              style={{ margin: "0 auto", display: "block" }}
            />
          </div>
        ) : (
          <div className="slc-tab-awaiting">
            <div className="slc-chart-block">
              <div className="slc-chart-title">Patients Awaiting Support</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={awaitingData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="Awaiting" fill="#edff3a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="slc-tab-title">Patients In Need — Your Help Matters</div>
            <div className="slc-tab-desc">
              Dozens of SMA patients remain on the waiting list for vital medication.
              Your donation helps deliver urgent hope. See their stories below.
            </div>
            <video
              src={SAMPLE_VIDEO}
              className="slc-tab-video"
              autoPlay
              loop
              muted
              playsInline
              style={{ margin: "0 auto", display: "block" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
