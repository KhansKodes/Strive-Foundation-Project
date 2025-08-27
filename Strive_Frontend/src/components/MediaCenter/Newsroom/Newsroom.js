import React, { useMemo, useState } from "react";
import "./Newsroom.css";
import heroImg from "../../../assets/images/hero.png";

/**
 * Newsroom page
 * - Hero with adjustable black overlay
 * - Centered tabs below hero: Featured Stories | Press Release
 * - Shows only the active tab's 6 items (list rows)
 */
export default function Newsroom() {
  const [tab, setTab] = useState("stories"); // 'stories' | 'press'

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
      { id: 4, title: "Registry Milestone: 500 Patients", date: "17 Jul 2025",
        img: "https://picsum.photos/seed/strive_story_4/640/420",
        excerpt: "Better data is powering smarter policy and faster access to treatment." },
      { id: 5, title: "SMA Awareness in Schools", date: "02 Jul 2025",
        img: "https://picsum.photos/seed/strive_story_5/640/420",
        excerpt: "Teachers and students learned the signs, myths, and pathways to care." },
      { id: 6, title: "Volunteer Spotlight: Rehab Aide", date: "18 Jun 2025",
        img: "https://picsum.photos/seed/strive_story_6/640/420",
        excerpt: "A volunteer’s week in the physio unit—small acts, big difference." },
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
      { id: 104, title: "International Collaboration on Trials",
        date: "21 Jul 2025",
        img: "https://picsum.photos/seed/strive_press_4/640/420",
        excerpt: "Agreement opens doors for Pakistan’s participation in SMA trials." },
      { id: 105, title: "Regional Rehab Trainings Completed",
        date: "08 Jul 2025",
        img: "https://picsum.photos/seed/strive_press_5/640/420",
        excerpt: "Physiotherapists upskilled in respiratory care and assisted mobility." },
      { id: 106, title: "Quarterly Impact Update Released",
        date: "22 Jun 2025",
        img: "https://picsum.photos/seed/strive_press_6/640/420",
        excerpt: "New report highlights treatment cycles, diagnostics, and follow-up." },
    ],
    []
  );

  const data = tab === "stories" ? stories : press;

  return (
    <main className="nr" style={{ "--overlay": 0.55 }}>
      {/* HERO */}
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

      {/* TABS */}
      <nav className="nr-tabs" role="tablist" aria-label="Newsroom categories">
        <button
          role="tab"
          aria-selected={tab === "stories"}
          className={`nr-tab ${tab === "stories" ? "is-active" : ""}`}
          onClick={() => setTab("stories")}
        >
          Featured Stories
        </button>
        <button
          role="tab"
          aria-selected={tab === "press"}
          className={`nr-tab ${tab === "press" ? "is-active" : ""}`}
          onClick={() => setTab("press")}
        >
          Press Release
        </button>
      </nav>

      {/* ACTIVE LIST (single column beneath tabs) */}
      <section
        className="nr-list-wrap container"
        role="tabpanel"
        aria-labelledby={tab === "stories" ? "Featured Stories" : "Press Release"}
      >
        <h4 className="nr-pill">{tab === "stories" ? "Featured Stories" : "Press Release"}</h4>

        <ul className="nr-list">
          {data.slice(0, 6).map((item) => (
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
      </section>
    </main>
  );
}
