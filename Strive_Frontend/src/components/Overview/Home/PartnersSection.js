import React, { useEffect, useState } from "react";
import "./PartnersSection.css";
import { fetchPartners } from "../../../services/partnersService"; // ← 3 dots from your path

const FALLBACK = {
  title: "Our Partners / Donors",
  partners: [
    { name: "Partner A", logo: "https://picsum.photos/seed/partner1/150" },
    { name: "Partner B", logo: "https://picsum.photos/seed/partner2/150" },
    { name: "Partner C", logo: "https://picsum.photos/seed/partner3/150" },
    { name: "Partner D", logo: "https://picsum.photos/seed/partner4/150" },
    { name: "Partner E", logo: "https://picsum.photos/seed/partner5/150" },
  ],
};

export default function PartnersSection() {
  const [title, setTitle] = useState(FALLBACK.title);
  const [partners, setPartners] = useState(FALLBACK.partners);

  useEffect(() => {
    let mounted = true;

    fetchPartners().then((data) => {
      if (!mounted || !data) return;

      // DEBUG: see what backend returned
      // eslint-disable-next-line no-console
      console.log("Partners API:", data);

      // Always set title if present (even if empty logos)
      if (data.title && typeof data.title === "string") {
        setTitle(data.title);
      }

      // Map API -> {name, logo, link}
      if (Array.isArray(data.logos)) {
        const mapped = data.logos
          .filter((l) => l && l.image_url) // only items with an image
          .map((l, idx) => ({
            name: l.alt_text ? String(l.alt_text) : `Partner ${idx + 1}`,
            logo: String(l.image_url),
            link: l.link_url ? String(l.link_url) : null,
            key: typeof l.order === "number" ? l.order : idx,
          }));

        // IMPORTANT CHANGE: set even if mapped is empty (so we stop showing dummy data)
        setPartners(mapped);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="PartnersSection">
      <h2 className="PartnersSection__title">
        {title} <span className="PartnersSection__arrow">👇</span>
      </h2>

      <div className="PartnersSection__grid">
        {partners.length === 0 ? (
          // keep layout stable even if backend has no logos yet
          <div style={{ opacity: 0.7, fontSize: 14, textAlign: "center", width: "100%" }}>
            Coming soon
          </div>
        ) : (
          partners.map((p, i) => {
            const handleClick = () => {
              if (p.link) window.open(p.link, "_blank", "noopener,noreferrer");
            };
            const clickableProps = p.link
              ? {
                  role: "button",
                  tabIndex: 0,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick();
                    }
                  },
                  style: { cursor: "pointer" },
                }
              : { tabIndex: -1 };

            return (
              <div
                key={p.key != null ? p.key : i}
                className="PartnersSection__item"
                onClick={handleClick}
                {...clickableProps}
                aria-label={p.link ? `${p.name} (opens in new tab)` : p.name}
                title={p.name}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="PartnersSection__img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
