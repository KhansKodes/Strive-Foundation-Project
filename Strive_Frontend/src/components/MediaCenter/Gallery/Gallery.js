import React, { useEffect, useMemo, useState } from "react";
import "./Gallery.css";
import heroImg from "../../../assets/images/hero.png";

export default function Gallery() {
  const [tab, setTab] = useState("photos"); // 'photos' | 'videos' | 'highlights'
  const [modal, setModal] = useState(null); // { type:'image'|'video', src, title, desc }

  // ---- Dummy data -----------------------------------------------------------
  const photos = useMemo(
    () => [
      {
        id: 1,
        title: "Therapy Session",
        desc: "Early mobility training with assistive devices.",
        src: "https://picsum.photos/seed/strive_photo_1/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_1/640/420",
      },
      {
        id: 2,
        title: "Clinic Day",
        desc: "Family counseling and follow-up planning.",
        src: "https://picsum.photos/seed/strive_photo_2/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_2/640/420",
      },
      {
        id: 3,
        title: "Awareness Talk",
        desc: "Students learning the signs of SMA.",
        src: "https://picsum.photos/seed/strive_photo_3/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_3/640/420",
      },
      {
        id: 4,
        title: "Registry Milestone",
        desc: "Celebrating new enrollments to the SMA registry.",
        src: "https://picsum.photos/seed/strive_photo_4/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_4/640/420",
      },
      {
        id: 5,
        title: "Home Care Visit",
        desc: "Care team demonstrating airway clearance.",
        src: "https://picsum.photos/seed/strive_photo_5/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_5/640/420",
      },
      {
        id: 6,
        title: "Volunteer Training",
        desc: "Techniques for safe transfers and positioning.",
        src: "https://picsum.photos/seed/strive_photo_6/1200/800",
        thumb: "https://picsum.photos/seed/strive_photo_6/640/420",
      },
    ],
    []
  );

  const videos = useMemo(
    () => [
      {
        id: 101,
        title: "What is SMA?",
        desc: "Short awareness clip.",
        youtubeId: "dQw4w9WgXcQ",
        thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      },
      {
        id: 102,
        title: "Parent Testimonial",
        desc: "Journey to diagnosis & care.",
        youtubeId: "9bZkp7q19f0",
        thumb: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      },
      {
        id: 103,
        title: "Clinic Walkthrough",
        desc: "How a typical visit works.",
        youtubeId: "3JZ_D3ELwOQ",
        thumb: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
      },
    ],
    []
  );

  const highlights = useMemo(
    () => [
      {
        id: 201,
        title: "Campaign: Hope Delivered",
        desc: "Treatment cycles funded this quarter.",
        img: "https://picsum.photos/seed/strive_high_1/640/420",
      },
      {
        id: 202,
        title: "Campus Drives",
        desc: "Volunteers mobilized across universities.",
        img: "https://picsum.photos/seed/strive_high_2/640/420",
      },
      {
        id: 203,
        title: "Screening Pilot",
        desc: "Carrier testing with digital counseling.",
        img: "https://picsum.photos/seed/strive_high_3/640/420",
      },
    ],
    []
  );

  // --- Modal UX: ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openImage = (item) =>
    setModal({ type: "image", src: item.src, title: item.title, desc: item.desc });
  const openVideo = (v) =>
    setModal({
      type: "video",
      src: `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`,
      title: v.title,
      desc: v.desc,
    });

  return (
    <main className="gl" style={{ "--overlay": 0.55 }}>
      {/* HERO (same styling as newsroom) */}
      <section className="gl-hero" aria-label="Gallery hero">
        <img src={'https://png.pngtree.com/thumb_back/fh260/background/20230607/pngtree-an-art-gallery-with-lots-of-framed-walls-image_2933000.jpg'} className="gl-hero__bg" alt="" />
        <div className="gl-hero__shade" />
        <div className="gl-hero__content">
          <h1 className="gl-hero__title">Gallery</h1>
          <p className="gl-hero__subtitle">
            Photos, videos, and campaign highlights from our work and community.
          </p>
        </div>
      </section>

      {/* TABS */}
      <nav className="gl-tabs container" role="tablist" aria-label="Gallery categories">
        {[
          { key: "photos", label: "Photos" },
          { key: "videos", label: "Videos" },
          { key: "highlights", label: "Campaign Highlights" },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`gl-tab ${tab === t.key ? "is-active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <section className="gl-body container" role="tabpanel">
        {tab === "photos" && (
          <ul className="gl-grid">
            {photos.map((p) => (
              <li key={p.id} className="gl-card" onClick={() => openImage(p)}>
                <div className="gl-card__media">
                  <img loading="lazy" src={p.thumb} alt={p.title} />
                </div>
                <div className="gl-card__meta">
                  <h3 className="gl-card__title">{p.title}</h3>
                  <p className="gl-card__desc">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === "videos" && (
          <ul className="gl-grid">
            {videos.map((v) => (
              <li key={v.id} className="gl-card" onClick={() => openVideo(v)}>
                <div className="gl-card__media gl-card__media--video">
                  <img loading="lazy" src={v.thumb} alt={v.title} />
                  <span className="gl-play" aria-hidden="true">▶</span>
                </div>
                <div className="gl-card__meta">
                  <h3 className="gl-card__title">{v.title}</h3>
                  <p className="gl-card__desc">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === "highlights" && (
          <ul className="gl-grid gl-grid--highlights">
            {highlights.map((h) => (
              <li key={h.id} className="gl-hcard">
                <div className="gl-hcard__media">
                  <img loading="lazy" src={h.img} alt={h.title} />
                </div>
                <div className="gl-hcard__meta">
                  <h3 className="gl-hcard__title">{h.title}</h3>
                  <p className="gl-hcard__desc">{h.desc}</p>
                  <a className="gl-hcard__link" href="#!">Read more</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MODAL */}
      {modal && (
        <div className="gl-modal" role="dialog" aria-modal="true" onClick={() => setModal(null)}>
          <div className="gl-modal__inner" onClick={(e) => e.stopPropagation()}>
            <button className="gl-modal__close" onClick={() => setModal(null)} aria-label="Close">
              ×
            </button>

            {modal.type === "image" ? (
              <>
                <img className="gl-modal__img" src={modal.src} alt={modal.title} />
                <h3 className="gl-modal__title">{modal.title}</h3>
                <p className="gl-modal__desc">{modal.desc}</p>
              </>
            ) : (
              <>
                <div className="gl-modal__videoWrap">
                  <iframe
                    src={modal.src}
                    title={modal.title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="gl-modal__title">{modal.title}</h3>
                <p className="gl-modal__desc">{modal.desc}</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
