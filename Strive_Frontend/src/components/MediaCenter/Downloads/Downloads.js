import React, { useEffect, useMemo, useState } from "react";
import "./Downloads.css";
import heroImg from "../../../assets/images/hero.png";
import { fetchFlyers, fetchReports, fetchAudits } from "../../../services/downloadsService";

/**
 * Downloads page
 * - Hero matches Newsroom vibe
 * - Tabs (no dropdowns): Flyers | Reports | Audit Report
 * - Filterable, responsive grid of row-style cards
 */
export default function Downloads() {
  const [activeCat, setActiveCat] = useState("flyers"); // 'flyers' | 'reports' | 'audits'

  const [flyers, setFlyers] = useState([]);
  const [reports, setReports] = useState([]);
  const [audits, setAudits] = useState([]);

  const [loading, setLoading] = useState({ flyers: false, reports: false, audits: false });
  const [error, setError] = useState({ flyers: "", reports: "", audits: "" });

  // Load lists once (fast tab switches)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading({ flyers: true, reports: true, audits: true });
      try {
        const [f, r, a] = await Promise.allSettled([
          fetchFlyers(),
          fetchReports(),
          fetchAudits(),
        ]);

        if (!cancelled) {
          if (f.status === "fulfilled") setFlyers(f.value);
          else setError((e) => ({ ...e, flyers: "Failed to load flyers." }));

          if (r.status === "fulfilled") setReports(r.value);
          else setError((e) => ({ ...e, reports: "Failed to load reports." }));

          if (a.status === "fulfilled") setAudits(a.value);
          else setError((e) => ({ ...e, audits: "Failed to load audit reports." }));
        }
      } finally {
        if (!cancelled) setLoading({ flyers: false, reports: false, audits: false });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Shape identical to your previous dummy "data" object
  const data = useMemo(() => ({
    flyers,
    reports,
    audits,
  }), [flyers, reports, audits]);

  const categories = [
    { key: "flyers", label: "Flyers" },
    { key: "reports", label: "Reports" },
    { key: "audits", label: "Audit Report" },
  ];

  const items = data[activeCat] ?? [];
  const isLoading = loading[activeCat];
  const err = error[activeCat];

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
          <span className="dl-count">
            {isLoading ? "Loading…" : `${items.length} items`}
          </span>
        </div>

        {/* Error message (keeps layout minimal) */}
        {err && <p className="dl-error">{err}</p>}

        <ul className="dl-grid">
          {/* Simple loading placeholders; keeps your design untouched */}
          {isLoading && !items.length && [...Array(3)].map((_, i) => (
            <li key={i} className="dl-card">
              <div className="dl-thumb skeleton" />
              <div className="dl-meta">
                <div className="dl-date skeleton-line" />
                <div className="dl-title skeleton-line" />
              </div>
            </li>
          ))}

          {!isLoading && items.map((it) => (
            <li key={it.id} className="dl-card">
              <div className="dl-thumb">
                <img src={it.thumb} alt={it.title} loading="lazy" />
                {it.type ? <span className="dl-badge">{it.type}</span> : null}
              </div>

              <div className="dl-meta">
                <time className="dl-date">
                  {it.date}{it.size ? ` • ${it.size}` : ""}
                </time>
                <h3 className="dl-title" title={it.title}>{it.title}</h3>
                <br />
                <div className="dl-actions">
                  <a className="dl-btn dl-btn--ghost" href={it.file} target="_blank" rel="noopener">
                    View
                  </a>
                  <a className="dl-btn" href={it.file} download target="_blank" rel="noopener">
                    Download
                  </a>
                </div>
              </div>
            </li>
          ))}

          {!isLoading && !items.length && (
            <li className="dl-card">
              <div className="dl-meta"><p>No items yet.</p></div>
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
