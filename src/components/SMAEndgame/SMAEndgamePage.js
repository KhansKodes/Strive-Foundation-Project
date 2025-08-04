import React from "react";
import "./SMAEndgamePage.css";
import { FaHeart, FaHandHoldingUsd, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SMAEndgamePage() {
  return (
    <div className="sma-endgame-fg-root">

      {/* HERO BANNER WITH OBJECTIVES */}
      <div className="sma-fg-hero">

        <div className="sma-fg-bg" />

        <div className="sma-fg-hero-content">
          <div className="sma-fg-hero-titles">
            <h2 className="sma-fg-hero-heading">
              STRIVE TOWARDS SMA ENDGAME
            </h2>
            <div className="sma-fg-hero-subheading">
              five year flagship program
            </div>
          </div>
          <div className="sma-fg-objectives-banner">
            <span>OBJECTIVES</span>
          </div>
          <div className="sma-fg-objectives-list-wrapper">
            <div className="sma-fg-objectives-list">
              <div className="sma-fg-objectives-col">
                <ol>
                  <li>
                    Make all globally approved SMA treatments available in Pakistan within 6–12 months of international approval.
                  </li>
                  <li>
                    Secure government adoption of SMA treatment coverage under national health programs for all patient groups.
                  </li>
                  <li>
                    Establish a sustainable National SMA Treatment Fund through public, private, and philanthropic partnerships.
                  </li>
                  <li>
                    Ensure treatment access for at least 75% of diagnosed SMA patients through coordinated national efforts.
                  </li>
                </ol>
              </div>
              <div className="sma-fg-objectives-divider"></div>
              <div className="sma-fg-objectives-col">
                <ol start="5">
                  <li>
                    Include SMA in national newborn screening and rare disease policies.
                  </li>
                  <li>
                    Build a centralized SMA patient registry to support data-driven planning and care.
                  </li>
                  <li>
                    Advance early detection and local research through screening, pilots and academic partnerships.
                  </li>
                  <li>
                    Prevent new SMA cases through genetic counseling, carrier screening, and prenatal testing integration.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="sma-fg-fiveyear-section">
          <button className="sma-fg-fiveyear-btn">Five Year plan</button>
          <div className="sma-fg-fiveyear-link">
            View & download the full roadmap
          </div>
        </div>
      </div>

      {/* CARDS BAR - RIBBON ARROW STYLE */}
      <div className="sma-fg-cards-bar">
        {/* <svg
          className="sma-fg-card-arrow-svg"
          viewBox="0 0 920 54"
          width="100%"
          height="54"
          preserveAspectRatio="none"
        >
          <rect x="20" y="20" width="870" height="14" rx="4" fill="#0d7e92ff" />
          <polygon points="0,27 20,20 20,34" fill="#427be5ff" />
          <polygon points="890,20 920,27 890,34" fill="#427be5ff" />
        </svg> */}
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
