import React, { useEffect, useState } from 'react';
import './MediaVolunteerSection.css';
import { getSpotlightPanel, getImpactMakersPanel } from '../../../services/spotlightService';

const PH_IMG = 'https://placehold.co/600x300?text=Image';
const PH_TEXT = ' ';

export default function MediaVolunteerSection() {
  const [spot, setSpot] = useState({
    title: 'In the Spotlight',
    subtitle: 'Where Strive’s journey meets the world’s attention.',
    items: [
      { image: PH_IMG, description: PH_TEXT, url: '' },
      { image: PH_IMG, description: PH_TEXT, url: '' },
    ],
  });

  const [impact, setImpact] = useState({
    title: 'Impact Makers',
    subtitle: 'Every act of kindness leaves a mark.',
    items: [
      { image: PH_IMG, description: PH_TEXT, url: '' },
      { image: PH_IMG, description: PH_TEXT, url: '' },
    ],
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const s = await getSpotlightPanel();
      const i = await getImpactMakersPanel();
      if (!mounted) return;

      // Fallbacks to keep layout stable
      setSpot({
        title: 'In the Spotlight',
        subtitle: s.subtitle || 'Where Strive’s journey meets the world’s attention.',
        items: s.items?.length ? s.items : spot.items,
      });

      setImpact({
        title: 'Impact Makers',
        subtitle: i.subtitle || 'Every act of kindness leaves a mark.',
        items: i.items?.length ? i.items : impact.items,
      });
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="MVS">
      {/* LEFT: Spotlight */}
      <div className="MVS__panel MVS__media">
        <div className="MVS__title">
          <h3>In the Spotlight</h3>
          <p className="qoute">{spot.subtitle}</p>
        </div>

        <div className="MVS__content">
          {/* top row — IMAGES */}
          <div className="MVS__row MVS__row--images">
            {spot.items.map((m, idx) => (
              <div key={`spot-img-${idx}`} className="MVS__card MVS__imgCard">
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noreferrer">
                    <img src={m.image || PH_IMG} alt="" />
                  </a>
                ) : (
                  <img src={m.image || PH_IMG} alt="" />
                )}
              </div>
            ))}
          </div>

          {/* bottom row — matching descriptions */}
          <div className="MVS__row MVS__row--texts">
            {spot.items.map((m, idx) => (
              <div key={`spot-txt-${idx}`} className="MVS__card MVS__textCard">
                <p>{m.description || PH_TEXT}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Impact Makers */}
      <div className="MVS__panel MVS__volunteer">
        <div className="MVS__title">
          <h3>Impact Makers</h3>
          <p className="qoute">{impact.subtitle}</p>
        </div>

        <div className="MVS__content">
          <div className="MVS__row MVS__row--images">
            {impact.items.map((m, idx) => (
              <div key={`imp-img-${idx}`} className="MVS__card MVS__imgCard">
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noreferrer">
                    <img src={m.image || PH_IMG} alt="" />
                  </a>
                ) : (
                  <img src={m.image || PH_IMG} alt="" />
                )}
              </div>
            ))}
          </div>

          <div className="MVS__row MVS__row--texts">
            {impact.items.map((m, idx) => (
              <div key={`imp-txt-${idx}`} className="MVS__card MVS__textCard">
                <p>{m.description || PH_TEXT}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
