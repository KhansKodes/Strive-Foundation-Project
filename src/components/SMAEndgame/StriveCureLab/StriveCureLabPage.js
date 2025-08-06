import React, { useState } from "react";
import "./StriveCureLabPage.css";
import { FaSearch, FaDatabase, FaFlask } from "react-icons/fa";

const HERO_BG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"; // Cure/science-related background

const TABS = [
  {
    key: "screening",
    label: "Newborn Screening Plan",
    icon: <FaSearch />,
    content: (
      <>
        <h3>Newborn Screening Plan</h3>
        <ul>
          <li>
            <b>Pilot screening programs</b> in partnership with hospitals and labs.
          </li>
          <li>
            Develop <b>screening protocols</b> for early detection of SMA in newborns.
          </li>
          <li>
            Train healthcare staff and raise parental awareness on the importance of early genetic screening.
          </li>
          <li>
            Work towards <b>integrating SMA into Pakistan's national newborn screening panel</b>.
          </li>
        </ul>
      </>
    ),
  },
  {
    key: "registry",
    label: "National Registry",
    icon: <FaDatabase />,
    content: (
      <>
        <h3>National SMA Patient Registry</h3>
        <ul>
          <li>
            Build and maintain a <b>secure, national database</b> of SMA cases across Pakistan.
          </li>
          <li>
            Collect anonymized data for <b>research, policy advocacy, and treatment planning</b>.
          </li>
          <li>
            Enable <b>data-driven resource allocation</b> for government and donors.
          </li>
          <li>
            Protect patient privacy in compliance with all ethical guidelines.
          </li>
        </ul>
      </>
    ),
  },
  {
    key: "research",
    label: "Research Partnership",
    icon: <FaFlask />,
    content: (
      <>
        <h3>Research & Prevention Partnerships</h3>
        <ul>
          <li>
            Foster <b>collaborative research</b> between Pakistani and international universities.
          </li>
          <li>
            Promote <b>clinical trials, genetic studies, and prevention initiatives</b>.
          </li>
          <li>
            Support <b>carrier screening</b> and <b>genetic counseling programs</b>.
          </li>
          <li>
            Advocate for the inclusion of SMA in national rare disease research agendas.
          </li>
        </ul>
      </>
    ),
  },
];

export default function StriveCureLabPage() {
  const [activeTab, setActiveTab] = useState("screening");

  return (
    <div className="scl-root">
      {/* HERO SECTION */}
      <div
        className="scl-hero"
        style={{
          backgroundImage: `url(${HERO_BG})`,
        }}
      >
        <div className="scl-hero-overlay"></div>
        <div className="scl-hero-content">
          <div className="scl-hero-title-row">
            <h1 className="scl-hero-title">STRIVE CURE LAB</h1>
          </div>
          <div className="scl-hero-subtitle">
            Leading research, screening, and prevention of SMA in Pakistan.
          </div>
          <button className="button-73">Join the Research</button>
          <div className="scl-hero-desc">
            <strong>Our Focus</strong>
            <br />
            Early diagnosis, data-driven policy, and collaborative science to end SMA at its root.
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="scl-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`scl-tab-btn ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="scl-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="scl-tab-content">
        {TABS.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
}
