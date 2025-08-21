import React, { useEffect, useMemo, useState } from 'react';
import './UrgentNeedSection.css';
import { fetchUrgentNeeds, fetchGetInvolved } from '../../../services/urgentNeedService';

// Static fallback for Get Involved (used if API empty/down)
const getInvolveItem = {
  title: 'Community Champion',
  description:
    'Host a local fundraiser in your area and multiply our reach. Host a local fundraiser in your area and multiply our reach.',
  imageUrl: 'https://picsum.photos/800/450?random=21',
  actionText: 'Get Started',
};

// Group items into pairs (two cards per slide)
function groupInPairs(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

export default function UrgentNeedSection() {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);

  // NEW: state for Get Involved (right panel)
  const [involved, setInvolved] = useState(null);

  // Fetch Urgent Need items (LEFT) — unchanged
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUrgentNeeds();
        const mapped = data
          .filter((x) => x.is_active)
          .sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0))
          .map((x) => ({
            id: x.id,
            stage: x.title ?? 'Untitled',
            description: x.description ?? '',
            imageUrl: x.image || '',
            donationPct: Math.max(0, Math.min(100, Number(x.donation_percentage) || 0)),
            donateUrl: x.donate_url || null,
          }));
        setItems(mapped);
      } catch (e) {
        console.error('Failed to load urgent needs:', e);
        setItems([]);
      }
    })();
  }, []);

  // NEW: fetch Get Involved item (RIGHT) — only this panel is affected
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGetInvolved();
        const picked =
          data
            .filter((x) => x.is_active)
            .sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0))[0] || null;
        setInvolved(picked);
      } catch (e) {
        console.error('Get Involved fetch failed:', e);
        setInvolved(null);
      }
    })();
  }, []);

  const slides = useMemo(() => groupInPairs(items), [items]);
  const slidesCount = Math.max(slides.length, 1);

  // Auto-advance slider
  useEffect(() => {
    if (slidesCount <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slidesCount), 5000);
    return () => clearInterval(id);
  }, [slidesCount]);

  // Clamp index if number of slides changes
  useEffect(() => {
    setCurrent((c) => Math.min(c, slidesCount - 1));
  }, [slidesCount]);

  return (
    <section className="UrgentNeedSection">
      <div className="split-container">
        {/* LEFT — URGENT NEED (unchanged) */}
        <div className="urgent-need-panel">
          <div className="urgent-header">
            <div className="urgent-header-bg" />
            <h2>U R G E N T&nbsp;&nbsp;N E E D</h2>
          </div>

          <div className="urgent-slider-wrapper">
            <div
              className="urgent-slider"
              style={{
                width: `${slidesCount * 100}%`,
                transform: `translateX(-${current * (100 / slidesCount)}%)`,
                '--slides': slidesCount, // important: makes each slide exactly viewport width
              }}
            >
              {slides.length > 0 ? (
                slides.map((group, idx) => (
                  <div className="slide" key={idx}>
                    {group.map((item) => (
                      <div className="urgent-card" key={item.id ?? item.stage}>
                        <div className="card-image">
                          <img
                            src={item.imageUrl || 'https://placehold.co/800x450?text=No+Image'}
                            alt={item.stage}
                            loading="lazy"
                          />
                        </div>

                        <div className="card-content">
                          <h3 className="card-title">{item.stage}</h3>
                          <p className="card-desc">{item.description}</p>

                          <div className="donation-bar">
                            <span className="donation-label">Donation</span>
                            <div className="progress">
                              <div
                                className="progress-filled"
                                style={{ width: `${item.donationPct}%` }}
                              />
                            </div>
                            <span className="donation-pct">{item.donationPct}%</span>
                          </div>

                          <button
                            className="donate-button"
                            onClick={() => item.donateUrl && window.open(item.donateUrl, '_blank')}
                            disabled={!item.donateUrl}
                            title={item.donateUrl ? 'Open donate page' : 'Donate link not provided'}
                          >
                            <span className="donate-icon">🤲</span>Donate
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Keep 2-up grid when odd count */}
                    {group.length === 1 && (
                      <div className="urgent-card placeholder" aria-hidden="true" />
                    )}
                  </div>
                ))
              ) : (
                // Simple skeleton for stable layout while loading
                <div className="slide">
                  <div className="urgent-card skeleton">
                    <div className="card-image skeleton-box" />
                    <div className="card-content">
                      <div className="skeleton-line" />
                      <div className="skeleton-line long" />
                      <div className="donation-bar">
                        <span className="donation-label">Donation</span>
                        <div className="progress">
                          <div className="progress-filled" style={{ width: '0%' }} />
                        </div>
                        <span className="donation-pct">0%</span>
                      </div>
                      <button className="donate-button" disabled>
                        <span className="donate-icon">🤲</span>Donate
                      </button>
                    </div>
                  </div>

                  <div className="urgent-card skeleton">
                    <div className="card-image skeleton-box" />
                    <div className="card-content">
                      <div className="skeleton-line" />
                      <div className="skeleton-line long" />
                      <div className="donation-bar">
                        <span className="donation-label">Donation</span>
                        <div className="progress">
                          <div className="progress-filled" style={{ width: '0%' }} />
                        </div>
                        <span className="donation-pct">0%</span>
                      </div>
                      <button className="donate-button" disabled>
                        <span className="donate-icon">🤲</span>Donate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="line" />

        {/* RIGHT — GET INVOLVED (now connected to backend) */}
        <div className="get-involved-panel">
          <div className="urgent-header">
            <div className="urgent-header-bg" />
            <h1>G E T&nbsp;&nbsp;I N V O L V E D</h1>
          </div>

          <div className="involved-card">
            <div className="card-image">
              <img
                src={involved?.image || getInvolveItem.imageUrl}
                alt={involved?.title || getInvolveItem.title}
                loading="lazy"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">{involved?.title || getInvolveItem.title}</h3>
              <p className="card-desc">{involved?.description || getInvolveItem.description}</p>
              <button
                className="donate-button"
                onClick={() => involved?.cta_url && window.open(involved.cta_url, '_blank')}
                disabled={!involved?.cta_url}
                title={involved?.cta_url ? 'Open details' : 'Link not available'}
              >
                {involved?.cta_label || getInvolveItem.actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
