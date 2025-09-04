import React, { useEffect, useState } from "react";
import "./Newsroom.css";
import heroImg from "../../../assets/images/hero.png";
import { getFeaturedStories, getPressReleases } from "../../../services/mediaCenterService";

export default function Newsroom() {
  const [tab, setTab] = useState("stories");
  const [stories, setStories] = useState([]);
  const [press, setPress] = useState([]);
  const [loading, setLoading] = useState({ stories: false, press: false });
  const [error, setError] = useState({ stories: "", press: "" });

  // Load both lists once so switching tabs is instant
  useEffect(() => {
    let cancelled = false;

    async function loadStories() {
      setLoading((s) => ({ ...s, stories: true }));
      try {
        const data = await getFeaturedStories();
        if (!cancelled) setStories(data);
        console.debug("[Newsroom] Featured Stories:", data);
      } catch (e) {
        if (!cancelled) setError((s) => ({ ...s, stories: "Could not load Featured Stories." }));
        console.error(e);
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, stories: false }));
      }
    }

    async function loadPress() {
      setLoading((s) => ({ ...s, press: true }));
      try {
        const data = await getPressReleases();
        if (!cancelled) setPress(data);
        console.debug("[Newsroom] Press Releases:", data);
      } catch (e) {
        if (!cancelled) setError((s) => ({ ...s, press: "Could not load Press Releases." }));
        console.error(e);
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, press: false }));
      }
    }

    loadStories();
    loadPress();
    return () => { cancelled = true; };
  }, []);

  const data = tab === "stories" ? stories : press;
  const isLoading = tab === "stories" ? loading.stories : loading.press;
  const errMsg = tab === "stories" ? error.stories : error.press;

  return (
    <main className="nr" style={{ "--overlay": 0.55 }}>
      {/* HERO */}
      <section className="nr-hero" aria-label="Newsroom hero">
        <img
          src={"https://media.istockphoto.com/id/1490920883/photo/news-room-with-stage-for-breaking-news.jpg?s=612x612&w=0&k=20&c=MC-zWfWh4uev2ELmPSeqAHjg8hrgmNVzIsJNEvZXuyE="}
          className="nr-hero__bg"
          alt=""
        />
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

      {/* ACTIVE LIST (two-column rows) */}
      <section
        className="nr-list-wrap container"
        role="tabpanel"
        aria-labelledby={tab === "stories" ? "Featured Stories" : "Press Release"}
      >
        {isLoading && (
          <ul className="nr-list">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="nr-row">
                <div className="nr-row__thumb skeleton" />
                <div className="nr-row__copy">
                  <div className="nr-row__date skeleton-line" />
                  <div className="nr-row__title skeleton-line" />
                  <div className="nr-row__excerpt skeleton-line" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && errMsg && <p className="nr-error">{errMsg}</p>}

        {!isLoading && !errMsg && (
          <ul className="nr-list">
            {data.map((item) => (
              <li key={item.id} className="nr-row">
                <div className="nr-row__thumb">
                  <img loading="lazy" src={item.img} alt={item.title} />
                </div>
                <div className="nr-row__copy">
                  <time className="nr-row__date">{item.date}</time>
                  <h3 className="nr-row__title" title={item.title}>{item.title}</h3>
                  <p className="nr-row__excerpt">{item.excerpt}</p>
                  <a className="nr-row__link" href={item.readMoreUrl || "#!"} target="_blank" rel="noreferrer">
                    Read more
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 5l7 7-7 7M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </a>
                </div>
              </li>
            ))}
            {data.length === 0 && <li className="nr-row"><div className="nr-row__copy"><p>No items yet.</p></div></li>}
          </ul>
        )}
      </section>
    </main>
  );
}
