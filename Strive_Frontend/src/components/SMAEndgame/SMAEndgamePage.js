import React, { useState, useEffect, useMemo } from "react";
import "./SMAEndgamePage.css";
import { FaHeart, FaHandHoldingUsd, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchSmaEndgame, fetchSmaInfoSections } from "../../services/smaEndgameService";

export default function SMAEndgamePage() {
  // Start with your current static content so design renders immediately
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  // --- Fetch in background; DO NOT block initial render or show loaders ---
  useEffect(() => {
    fetchSmaEndgame().then(setPage).catch(() => {});
    fetchSmaInfoSections().then(setSections).catch(() => {});
  }, []);

  // Fallbacks = your existing static text (keeps exact design)
  const fallback = useMemo(() => ({
    title: "STRIVE TOWARDS SMA ENDGAME",
    subtitle: "five year flagship program",
    objectives: [
      { order: 1, title: "Make all globally approved SMA treatments available in Pakistan within 6–12 months of international approval." },
      { order: 2, title: "Secure government adoption of SMA treatment coverage under national health programs for all patient groups." },
      { order: 3, title: "Establish a sustainable National SMA Treatment Fund through public, private, and philanthropic partnerships." },
      { order: 4, title: "Ensure treatment access for at least 75% of diagnosed SMA patients through coordinated national efforts." },
      { order: 5, title: "Include SMA in national newborn screening and rare disease policies." },
      { order: 6, title: "Build a centralized SMA patient registry to support data-driven planning and care." },
      { order: 7, title: "Advance early detection and local research through screening, pilots and academic partnerships." },
      { order: 8, title: "Prevent new SMA cases through genetic counseling, carrier screening, and prenatal testing integration." },
    ],
    plan_heading: "Five Year plan",
    plan_subheading: "View & download the full roadmap",
    plan_url: "/dummy-sma-roadmap.pdf",
    about_title: "About The SMA Endgame",
    about_desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis feugiat dolor eu ornare. Mauris vitae bibendum elit ac leo pellentesque gravida. Etiam facilisis venenatis enim, eu euismod justo convallis eget. Duis posuere, turpis at pharetra laoreet, orci ante finibus nulla, id aliquam velit nulla pretium enim.",
    what_title: "What is SMA?",
    what_desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis feugiat dolor eu ornare. Mauris vitae bibendum elit ac leo pellentesque gravida. Etiam facilisis venenatis enim, eu euismod justo convallis eget. Duis posuere, turpis at pharetra laoreet, orci ante finibus nulla, id aliquam velit nulla pretium enim.",
  }), []);

  // Merge live page data over fallbacks (text-only hydration)
  const headerTitle     = page?.title       || fallback.title;
  const headerSubtitle  = page?.subtitle    || fallback.subtitle;
  const planHeading     = page?.plan_heading    || fallback.plan_heading;
  const planSubheading  = page?.plan_subheading || fallback.plan_subheading;
  const planUrl         = page?.plan_url        || fallback.plan_url;

  // Objectives (preserve order, split into two cols)
  const objectives = useMemo(() => {
    const src = Array.isArray(page?.objectives) && page.objectives.length ? page.objectives : fallback.objectives;
    return [...src].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [page, fallback]);

  const midpoint = Math.ceil(objectives.length / 2);
  const leftColumnObjectives  = objectives.slice(0, midpoint);
  const rightColumnObjectives = objectives.slice(midpoint);
  const rightStart = rightColumnObjectives[0]?.order ?? (midpoint + 1);

  // Sections: map by slug; if not present, use fallbacks (no new elements)
  const about  = sections.find(s => s.slug === "about-endgame");
  const whatIs = sections.find(s => s.slug === "what-is-sma");

  const aboutTitle = about?.title || fallback.about_title;
  const aboutDesc  = about?.description || fallback.about_desc;
  const whatTitle  = whatIs?.title || fallback.what_title;
  const whatDesc   = whatIs?.description || fallback.what_desc;

  return (
    <div className="sma-endgame-fg-root">

      {/* HERO BANNER WITH OBJECTIVES (unchanged structure) */}
      <div className="sma-fg-hero">
        <div className="sma-fg-bg" />

        <div className="sma-fg-hero-content">
          <div className="sma-fg-hero-titles">
            <h2 className="sma-fg-hero-heading">{headerTitle}</h2>
            <div className="sma-fg-hero-subheading">{headerSubtitle}</div>
          </div>

          <div className="sma-fg-objectives-banner">
            <span>OBJECTIVES</span>
          </div>

          <div className="sma-fg-objectives-list-wrapper">
            <div className="sma-fg-objectives-list">
              <div className="sma-fg-objectives-col">
                <ol>
                  {leftColumnObjectives.map((o) => (
                    <li key={o.order}>{o.title}</li>
                  ))}
                </ol>
              </div>

              <div className="sma-fg-objectives-divider"></div>

              <div className="sma-fg-objectives-col">
                <ol start={rightStart}>
                  {rightColumnObjectives.map((o) => (
                    <li key={o.order}>{o.title}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="sma-fg-fiveyear-section">
          <a
            className="sma-fg-fiveyear-btn"
            href={planUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {planHeading}
            <div className="sma-fg-fiveyear-link">{planSubheading}</div>
          </a>
        </div>
      </div>

      {/* CARDS BAR - RIBBON ARROW STYLE (unchanged) */}
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

      {/* ABOUT + WHAT IS SMA (exact same DOM and classes; text hydrated) */}
      <div className="sma-fg-desc-section">
        <div className="sma-fg-desc-left">
          <h3 className="sma-fg-desc-heading">{aboutTitle}</h3>
          <div className="sma-fg-desc-text">{aboutDesc}</div>
        </div>
        <div className="sma-fg-desc-divider"></div>
        <div className="sma-fg-desc-right">
          <h3 className="sma-fg-desc-heading">{whatTitle}</h3>
          <div className="sma-fg-desc-text">{whatDesc}</div>
        </div>
      </div>
    </div>
  );
}
