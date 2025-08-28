import React, { useMemo, useState } from "react";
import "./Downloads.css";
import heroImg from "../../../assets/images/hero.png";

/**
 * Downloads page
 * - Hero matches Newsroom vibe
 * - Tabs (no dropdowns): Flyers | Reports | Audit Report
 * - Filterable, responsive grid of row-style cards
 */
export default function Downloads() {
  const [activeCat, setActiveCat] = useState("flyers"); // 'flyers' | 'reports' | 'audits'

  // ----- Dummy data (swap with API later) ------------------------------------
  const data = useMemo(
    () => ({
      flyers: [
        {
          id: "f1",
          title: "SMA Awareness – School Flyer",
          date: "Aug 2025",
          size: "1.2 MB",
          type: "JPG",
          thumb: "https://picsum.photos/seed/flyer_1/640/420",
          file: "https://picsum.photos/seed/flyer_1/1200/800",
        },
        {
          id: "f2",
          title: "Strive Life Club – Intro",
          date: "Aug 2025",
          size: "1.0 MB",
          type: "PNG",
          thumb: "https://picsum.photos/seed/flyer_2/640/420",
          file: "https://picsum.photos/seed/flyer_2/1200/800",
        },
        {
          id: "f3",
          title: "Volunteer Drive – Campus",
          date: "Jul 2025",
          size: "900 KB",
          type: "PNG",
          thumb: "https://picsum.photos/seed/flyer_3/640/420",
          file: "https://picsum.photos/seed/flyer_3/1200/800",
        },
      ],
      reports: [
        {
          id: "r1",
          title: "Quarterly Impact Report – Q2",
          date: "Jul 2025",
          size: "3.4 MB",
          type: "PDF",
          thumb: "https://picsum.photos/seed/report_1/640/420",
          file: "https://example.com/dummy-report-q2.pdf",
        },
        {
          id: "r2",
          title: "Program Update – Screening Pilot",
          date: "Jun 2025",
          size: "2.1 MB",
          type: "PDF",
          thumb: "https://picsum.photos/seed/report_2/640/420",
          file: "https://example.com/dummy-screening.pdf",
        },
        {
          id: "r3",
          title: "Registry Milestone Summary",
          date: "Jun 2025",
          size: "2.8 MB",
          type: "PDF",
          thumb: "https://picsum.photos/seed/report_3/640/420",
          file: "https://example.com/dummy-registry.pdf",
        },
      ],
      audits: [
        {
          id: "a1",
          title: "Audit Report – FY 2023-24",
          date: "May 2025",
          size: "4.6 MB",
          type: "PDF",
          thumb: "https://picsum.photos/seed/audit_1/640/420",
          file: "https://example.com/dummy-audit-2324.pdf",
        },
        {
          id: "a2",
          title: "Management Letter – FY 2023-24",
          date: "May 2025",
          size: "1.7 MB",
          type: "PDF",
          thumb: "https://picsum.photos/seed/audit_2/640/420",
          file: "https://example.com/dummy-letter-2324.pdf",
        },
      ],
    }),
    []
  );

  const categories = [
    { key: "flyers", label: "Flyers" },
    { key: "reports", label: "Reports" },
    { key: "audits", label: "Audit Report" },
  ];

  const items = data[activeCat] ?? [];

  return (
    <main className="dl" style={{ "--overlay": 0.55 }}>
      {/* HERO */}
      <section className="dl-hero" aria-label="Downloads hero">
        <img src={heroImg} className="dl-hero__bg" alt="" />
        <div className="dl-hero__shade" />
        <div className="dl-hero__content">
          <h1 className="dl-hero__title">Downloads</h1>
          <p className="dl-hero__subtitle">
            Flyers, reports, and audit documents — browse, view, or download.
          </p>
        </div>
      </section>

      {/* TABS (no dropdowns) */}
      <nav className="dl-tabs container" role="tablist" aria-label="Download categories">
        {categories.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={activeCat === c.key}
            className={`dl-tab ${activeCat === c.key ? "is-active" : ""}`}
            onClick={() => setActiveCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {/* GRID */}
      <section className="dl-grid-wrap container" role="region" aria-live="polite">
        <div className="dl-grid-head">
          {/* <h4 className="dl-tag">{categories.find((x) => x.key === activeCat)?.label}</h4> */}
          <span className="dl-count">{items.length} items</span>
        </div>

        <ul className="dl-grid">
          {items.map((it) => (
            <li key={it.id} className="dl-card">
              <div className="dl-thumb">
                <img src={it.thumb} alt={it.title} loading="lazy" />
                <span className="dl-badge">{it.type}</span>
              </div>

              <div className="dl-meta">
                <time className="dl-date">{it.date} • {it.size}</time>
                <h3 className="dl-title" title={it.title}>{it.title}</h3>
                <br></br>
              <div className="dl-actions">
                <a
                  className="dl-btn dl-btn--ghost"
                  href={it.file}
                  target="_blank"
                  rel="noopener"
                >
                  View
                </a>
                <a
                  className="dl-btn"
                  href={it.file}
                  download
                  target="_blank"
                  rel="noopener"
                >
                  Download
                </a>
              </div>
              </div>

            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
