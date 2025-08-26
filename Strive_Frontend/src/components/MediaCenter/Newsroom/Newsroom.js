import React, { useMemo } from "react";
import "./Newsroom.css";
import heroImg from "../../../assets/images/hero.png";

/**
 * Newsroom page
 * - Hero with adjustable black overlay
 * - Two fixed columns below hero: Featured Stories (6) | Press Release (6)
 * - Swap dummy arrays with API data later
 */
export default function Newsroom() {
  // ---- Dummy data (swap with API results later) -----------------------------
  const stories = useMemo(
    () => [
      { id: 1, title: "Child Starts Treatment Cycle 1", date: "12 Aug 2025",
        img: "https://picsum.photos/seed/strive_story_1/640/420",
        excerpt: "Early diagnosis enabled timely access to therapy and multidisciplinary care." },
      { id: 2, title: "Clinic Expands to Remote Districts", date: "05 Aug 2025",
        img: "https://picsum.photos/seed/strive_story_2/640/420",
        excerpt: "Mobile teams reached families with screening, counseling, and follow-up." },
      { id: 3, title: "Parents’ Training on Home Care", date: "28 Jul 2025",
        img: "https://picsum.photos/seed/strive_story_3/640/420",
        excerpt: "Hands-on guidance for feeding, airway care, and safe mobility at home." },
    ],
    []
  );

  const press = useMemo(
    () => [
      { id: 101, title: "Strive Launches SMA Online Patient Registry",
        date: "20 Aug 2025",
        img: "https://picsum.photos/seed/strive_press_1/640/420",
        excerpt: "A national platform to unify patient data and enable evidence-based policy." },
      { id: 102, title: "MoU for Government-Supported Treatment",
        date: "10 Aug 2025",
        img: "https://picsum.photos/seed/strive_press_2/640/420",
        excerpt: "Partnership framework to expand access to approved SMA therapies." },
      { id: 103, title: "Carrier Screening Pilot Announced",
        date: "29 Jul 2025",
        img: "https://picsum.photos/seed/strive_press_3/640/420",
        excerpt: "Pilot introduces tech-enabled counseling and referral pathways." },
    ],
    []
  );

  return (
    <main className="nr" style={{ "--overlay": 0.55 }}>
      {/* HERO (unchanged) */}
      <section className="nr-hero" aria-label="Newsroom hero">
        <img src={heroImg} className="nr-hero__bg" alt="" />
        <div className="nr-hero__shade" />
        <div className="nr-hero__content">
          <h1 className="nr-hero__title">Newsroom</h1>
          <p className="nr-hero__subtitle">
            Updates on treatment access, repeated cycles, diagnostics, and follow-up.
          </p>
        </div>
      </section>

      {/* TWO COLUMNS BELOW HERO */}
      <section className="nr-lists container" aria-label="Newsroom lists">
        {/* LEFT: Featured Stories */}
        <div className="nr-col ">
          <h4 className="nr-pill">Featured Stories</h4>
          <ul className="nr-list nr-col-left">
            {stories.slice(0, 6).map((item) => (
              <li key={item.id} className="nr-row">
                <div className="nr-row__thumb">
                  <img loading="lazy" src={item.img} alt={item.title} />
                </div>
                <div className="nr-row__copy">
                  <time className="nr-row__date">{item.date}</time>
                  <h3 className="nr-row__title" title={item.title}>{item.title}</h3>
                  <p className="nr-row__excerpt">{item.excerpt}</p>
                  <a className="nr-row__link" href="#!">
                    Read more
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 5l7 7-7 7M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle divider */}
        <div className="nr-divider" aria-hidden="true" />

        {/* RIGHT: Press Release */}
        <div className="nr-col ">
          <h4 className="nr-pill nr-pill--right">Press Release</h4>
          <ul className="nr-list nr-col-right">
            {press.slice(0, 6).map((item) => (
              <li key={item.id} className="nr-row">
                <div className="nr-row__thumb">
                  <img loading="lazy" src={item.img} alt={item.title} />
                </div>
                <div className="nr-row__copy">
                  <time className="nr-row__date">{item.date}</time>
                  <h3 className="nr-row__title" title={item.title}>{item.title}</h3>
                  <p className="nr-row__excerpt">{item.excerpt}</p>
                  <a className="nr-row__link" href="#!">
                    Read more
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 5l7 7-7 7M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
