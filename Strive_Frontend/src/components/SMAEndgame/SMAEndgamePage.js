import React, { useState, useEffect } from "react";
import "./SMAEndgamePage.css";
import { FaHeart, FaHandHoldingUsd, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchSmaEndgame } from "../../services/smaEndgameService";

export default function SMAEndgamePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSmaEndgame()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="sma-endgame-fg-root">Loading...</div>;
  }

  if (error) {
    return <div className="sma-endgame-fg-root">Error loading content: {error.message}</div>;
  }

  if (!data) {
    return <div className="sma-endgame-fg-root">No content available</div>;
  }

  // Split objectives into two columns for display
  const objectives = data.objectives || [];
  const midpoint = Math.ceil(objectives.length / 2);
  const leftColumnObjectives = objectives.slice(0, midpoint);
  const rightColumnObjectives = objectives.slice(midpoint);

  return (
    <div className="sma-endgame-fg-root">

      {/* HERO BANNER WITH OBJECTIVES */}
      <div className="sma-fg-hero">

        <div className="sma-fg-bg" />

        <div className="sma-fg-hero-content">
          <div className="sma-fg-hero-titles">
            <h2 className="sma-fg-hero-heading">
              {data.title || "STRIVE TOWARDS SMA ENDGAME"}
            </h2>
            <div className="sma-fg-hero-subheading">
              {data.subtitle || "five year flagship program"}
            </div>
          </div>
          <div className="sma-fg-objectives-banner">
            <span>OBJECTIVES</span>
          </div>
          <div className="sma-fg-objectives-list-wrapper">
            <div className="sma-fg-objectives-list">
              <div className="sma-fg-objectives-col">
                <ol>
                  {leftColumnObjectives.map((objective) => (
                    <li key={objective.order}>
                      {objective.title}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="sma-fg-objectives-divider"></div>
              <div className="sma-fg-objectives-col">
                <ol start={midpoint + 1}>
                  {rightColumnObjectives.map((objective) => (
                    <li key={objective.order}>
                      {objective.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="sma-fg-fiveyear-section">
          <a
            className="sma-fg-fiveyear-btn"
            href={data.plan_url || "/dummy-sma-roadmap.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            download={false}  // let browser open PDF, remove if you want forced download
          >
            {data.plan_heading || "Five Year plan"}
            <div className="sma-fg-fiveyear-link">
              {data.plan_subheading || "View & download the full roadmap"}
            </div>
          </a>
        </div>
      </div>

      {/* CARDS BAR - RIBBON ARROW STYLE */}
      <div className="sma-fg-cards-bar">
        <div className="sma-fg-cards-container">
          <Link to="/sma-endgame/life-club" className="button-92 sma-fg-card sma-fg-card-left">
            <FaHeart className="sma-fg-card-icon" />
            <div className="sma-fg-card-title">Strive LIFE CLUB</div>
          </Link>
          <Link to="/sma-endgame/beacon-initiative" className="button-92 sma-fg-card sma-fg-card-center">
            <FaHandHoldingUsd className="sma-fg-card-icon" />
            <div className="sma-fg-card-title">Strive Beacon Initiative</div>
          </Link>
          <Link to="/sma-endgame/cure-lab" className="button-92 sma-fg-card sma-fg-card-right">
            <FaSearch className="sma-fg-card-icon" />
            <div className="sma-fg-card-title">Strive Cure Lab</div>
          </Link>
        </div>
      </div>

      {/* ABOUT + WHAT IS SMA */}
      <div className="sma-fg-desc-section">
        <div className="sma-fg-desc-left">
          <h3 className="sma-fg-desc-heading">About The SMA Endgame</h3>
          <div className="sma-fg-desc-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis feugiat dolor eu ornare.
            Mauris vitae bibendum elit ac leo pellentesque gravida.
            Etiam facilisis venenatis enim, eu euismod justo convallis eget.
            Duis posuere, turpis at pharetra laoreet, orci ante finibus nulla,
            id aliquam velit nulla pretium enim.
          </div>
        </div>
        <div className="sma-fg-desc-divider"></div>
        <div className="sma-fg-desc-right">
          <h3 className="sma-fg-desc-heading">What is SMA?</h3>
          <div className="sma-fg-desc-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis feugiat dolor eu ornare.
            Mauris vitae bibendum elit ac leo pellentesque gravida.
            Etiam facilisis venenatis enim, eu euismod justo convallis eget.
            Duis posuere, turpis at pharetra laoreet, orci ante finibus nulla,
            id aliquam velit nulla pretium enim.
          </div>
        </div>
      </div>
    </div>
  );
}
