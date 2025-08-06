import React, { useState } from "react";
import "./OurIdentityPage.css";

const TABS = [
  { label: "Founder & Leadership", key: "leadership" },
  { label: "Legal structure", key: "legal" },
  { label: "Strive Profile", key: "profile" },
  { label: "Vision & Mission", key: "vision" },
];

const DUMMY_CEO = {
  name: "Mr. Yasir Khan",
  title: "CEO & Founder",
  image: "https://picsum.photos/id/1011/120/120",
  desc: "Yasir Khan is the visionary founder and current CEO of Strive Foundation, leading the fight for disability rights in Pakistan.",
};

const DUMMY_DIRECTORS = [
  {
    name: "Ms. Saman Fatima",
    title: "Director Programs",
    image: "https://picsum.photos/id/1027/90/90",
    desc: "Leading program development with passion for inclusion.",
  },
  {
    name: "Mr. Ahmed Raza",
    title: "Director Finance",
    image: "https://picsum.photos/id/1005/90/90",
    desc: "Ensuring transparent and impactful financial strategies.",
  },
  {
    name: "Ms. Nida Asghar",
    title: "Director Outreach",
    image: "https://picsum.photos/id/1012/90/90",
    desc: "Building partnerships for a more accessible future.",
  },
];

const DUMMY_CONTENT = {
  legal: (
    <div>
      <h2>Legal Structure</h2>
      <p>
        Strive Foundation is registered under Section 42 of the SECP, ensuring legal compliance and robust governance for all initiatives.
      </p>
      <p>
        Our legal journey began as Strive Trust (2010–2023) and evolved into Strive Foundation in 2023.
      </p>
    </div>
  ),
  profile: (
    <div>
      <h2>Strive Profile</h2>
      <p>
        Strive is Pakistan’s leading SMA-focused nonprofit, providing hope, advocacy, and lifesaving support for children and families.
      </p>
      <p>
        From patient sponsorships to nationwide awareness, Strive sets benchmarks in disability rights.
      </p>
    </div>
  ),
  vision: (
    <div>
      <h2>Vision & Mission</h2>
      <strong>Vision:</strong>
      <p>
        A Pakistan free from the barriers of neuromuscular disability.
      </p>
      <strong>Mission:</strong>
      <p>
        To eradicate SMA through direct support, policy advocacy, and public awareness, empowering every affected family.
      </p>
    </div>
  ),
};

export default function OurIdentityPage() {
  const [selectedTab, setSelectedTab] = useState("leadership");

  return (
    <>
      <div className="our-identity-hero-bg">
        <div className="our-identity-bg-overlay"></div>
        <div className="our-identity-main">
          {/* Tabs */}
          <div className="our-identity-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`our-identity-tab-btn ${
                  selectedTab === tab.key ? "active" : ""
                }`}
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Content */}
          <div className="our-identity-tab-content">
            {selectedTab === "leadership" ? (
              <div className="our-identity-leadership">
                <div className="our-identity-ceo-row">
                  <img
                    src={DUMMY_CEO.image}
                    alt={DUMMY_CEO.name}
                    className="our-identity-ceo-img"
                  />
                  <div>
                    <h3>{DUMMY_CEO.name}</h3>
                    <span className="ceo-title">{DUMMY_CEO.title}</span>
                    <p>{DUMMY_CEO.desc}</p>
                  </div>
                </div>
                <div className="our-identity-directors-row">
                  {DUMMY_DIRECTORS.map((dir, i) => (
                    <div className="our-identity-director-card" key={i}>
                      <img
                        src={dir.image}
                        alt={dir.name}
                        className="our-identity-director-img"
                      />
                      <div>
                        <h4>{dir.name}</h4>
                        <span className="director-title">{dir.title}</span>
                        <p>{dir.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="our-identity-generic-content">
                {DUMMY_CONTENT[selectedTab]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Objectives Section */}
      <section className="objectives-section">
        <div className="objectives-container">
          <h2 className="objectives-heading">OBJECTIVES</h2>
          <div className="objectives-content-row">
            <img
              className="objectives-icon"
              src="https://cdn-icons-png.flaticon.com/512/2983/2983705.png"
              alt="Objectives Icon"
            />
            <div>
              <h3 className="objectives-title">Lorem ipsum dolor sit amet,</h3>
              <ul className="objectives-list">
                <li>
                  <b>(a)</b> ipsum dolor sit amet, consectetuer
                </li>
                <li>
                  <b>(b)</b> ipsum dolor sit amet, consectetuer ipsum dolor sit amet, consectetuer
                </li>
                <li>
                  <b>(c)</b> ipsum dolor sit amet, consectetuer met, consectetue
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
