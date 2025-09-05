import React, { useEffect, useState } from "react";
import "./Gallery.css";
import heroImg from "../../../assets/images/hero.png";
import { fetchPhotos, fetchVideos, fetchHighlights } from "../../../services/galleryService";

export default function Gallery() {
  const [tab, setTab] = useState("photos"); // 'photos' | 'videos' | 'highlights'
  const [modal, setModal] = useState(null); // { type:'image'|'video', src, title, desc }

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [highlights, setHighlights] = useState([]);

  const [loading, setLoading] = useState({ photos: false, videos: false, highlights: false });
  const [error, setError] = useState({ photos: "", videos: "", highlights: "" });

  // Load all three lists once (fast UX when switching tabs)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading({ photos: true, videos: true, highlights: true });

        const [pRes, vRes, hRes] = await Promise.allSettled([
          fetchPhotos(),
          fetchVideos(),
          fetchHighlights(),
        ]);

        if (!cancelled) {
          if (pRes.status === "fulfilled") setPhotos(pRes.value);
          else setError((e) => ({ ...e, photos: "Failed to load photos." }));

          if (vRes.status === "fulfilled") setVideos(vRes.value);
          else setError((e) => ({ ...e, videos: "Failed to load videos." }));

          if (hRes.status === "fulfilled") setHighlights(hRes.value);
          else setError((e) => ({ ...e, highlights: "Failed to load highlights." }));
        }
      } finally {
        if (!cancelled) setLoading({ photos: false, videos: false, highlights: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // --- Modal open helpers keep your existing behavior
  const openImage = (item) =>
    setModal({ type: "image", src: item.src, title: item.title, desc: item.desc });

  const openVideo = (v) =>
    setModal({
      type: "video",
      src: v.youtubeId
        ? `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`
        : v._rawUrl, // fallback if you ever store non-YouTube links
      title: v.title,
      desc: v.desc,
    });

  return (
    <main className="gl" style={{ "--overlay": 0.55 }}>
      {/* HERO */}
      <section className="gl-hero" aria-label="Gallery hero">
        <img
          src={"https://png.pngtree.com/thumb_back/fh260/background/20230607/pngtree-an-art-gallery-with-lots-of-framed-walls-image_2933000.jpg"}
          className="gl-hero__bg"
          alt=""
        />
        <div className="gl-hero__shade" />
        <div className="gl-hero__content">
          <h1 className="gl-hero__title">Gallery</h1>
          <p className="gl-hero__subtitle">Photos, videos, and campaign highlights from our work and community.</p>
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
        {/* Photos */}
        {tab === "photos" && (
          <>
            {loading.photos && (
              <ul className="gl-grid">{[...Array(6)].map((_, i) => (
                <li key={i} className="gl-card">
                  <div className="gl-card__media skeleton" />
                  <div className="gl-card__meta">
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                </li>
              ))}</ul>
            )}
            {!loading.photos && (
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
                {!photos.length && <li className="gl-card"><div className="gl-card__meta"><p>No photos yet.</p></div></li>}
              </ul>
            )}
          </>
        )}

        {/* Videos */}
        {tab === "videos" && (
          <>
            {loading.videos && (
              <ul className="gl-grid">{[...Array(3)].map((_, i) => (
                <li key={i} className="gl-card">
                  <div className="gl-card__media skeleton" />
                  <div className="gl-card__meta">
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                </li>
              ))}</ul>
            )}
            {!loading.videos && (
              <ul className="gl-grid">
                {videos.map((v) => (
                  <li key={v.id} className="gl-card" onClick={() => openVideo(v)}>
                    <div className="gl-card__media gl-card__media--video">
                      {/* If you ever store non-YouTube URLs, thumb may be empty; your CSS still keeps layout. */}
                      <img loading="lazy" src={v.thumb || ""} alt={v.title} />
                      <span className="gl-play" aria-hidden="true">▶</span>
                    </div>
                    <div className="gl-card__meta">
                      <h3 className="gl-card__title">{v.title}</h3>
                      <p className="gl-card__desc">{v.desc}</p>
                    </div>
                  </li>
                ))}
                {!videos.length && <li className="gl-card"><div className="gl-card__meta"><p>No videos yet.</p></div></li>}
              </ul>
            )}
          </>
        )}

        {/* Campaign Highlights */}
        {tab === "highlights" && (
          <>
            {loading.highlights && (
              <ul className="gl-grid gl-grid--highlights">{[...Array(3)].map((_, i) => (
                <li key={i} className="gl-hcard">
                  <div className="gl-hcard__media skeleton" />
                  <div className="gl-hcard__meta">
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                </li>
              ))}</ul>
            )}
            {!loading.highlights && (
              <ul className="gl-grid gl-grid--highlights">
                {highlights.map((h) => (
                  <li key={h.id} className="gl-hcard">
                    <div className="gl-hcard__media">
                      <img loading="lazy" src={h.img} alt={h.title} />
                    </div>
                    <div className="gl-hcard__meta">
                      <h3 className="gl-hcard__title">{h.title}</h3>
                      <p className="gl-hcard__desc">{h.desc}</p>
                      <a className="gl-hcard__link" href={h.url || "#!"} target="_blank" rel="noreferrer">Read more</a>
                    </div>
                  </li>
                ))}
                {!highlights.length && <li className="gl-hcard"><div className="gl-hcard__meta"><p>No highlights yet.</p></div></li>}
              </ul>
            )}
          </>
        )}
      </section>

      {/* MODAL */}
      {modal && (
        <div className="gl-modal" role="dialog" aria-modal="true" onClick={() => setModal(null)}>
          <div className="gl-modal__inner" onClick={(e) => e.stopPropagation()}>
            <button className="gl-modal__close" onClick={() => setModal(null)} aria-label="Close">×</button>
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
