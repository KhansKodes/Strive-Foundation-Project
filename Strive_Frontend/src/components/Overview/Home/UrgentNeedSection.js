import React, { useState, useEffect } from 'react';
import './UrgentNeedSection.css';
import api from '../../../services/api';
const ENDPOINT = '/urgent-need/';

const getInvolveItem = {
  title: 'Community Champion',
  description:
    'Host a local fundraiser in your area and multiply our reach.... Host a local fundraiser in your area and multiply our reach.',
  imageUrl: 'https://picsum.photos/400/250?random=21',
  actionText: 'Get Started',
};

export default function UrgentNeedSection() {
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);

  // Fetch from API once (LEFT side only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(ENDPOINT);
        const mapped = (Array.isArray(data) ? data : [])
          .filter((x) => x.is_active)
          .sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0))
          .map((x) => ({
            stage: x.title,
            description: x.description,
            imageUrl: x.image, // absolute media URL
            donationPct: Number(x.donation_percentage) || 0,
            donateUrl: x.donate_url || null,
          }));
        if (!cancelled) setItems(mapped);
      } catch (e) {
        console.error('Failed to load urgent needs:', e);
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build sliding windows of two, wrapping at the end (from live items)
  const slideGroups =
    items.length >= 2
      ? items.map((_, i) => [items[i], items[(i + 1) % items.length]])
      : items.length === 1
      ? [[items[0]]]
      : [];

  const count = Math.max(slideGroups.length, 1);

  // Auto-advance slider (keep your existing timing)
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="UrgentNeedSection">
      <div className="split-container">
        {/* — Left: URGENT NEED — */}
        <div className="urgent-need-panel">
          <div className="urgent-header">
            <div className="urgent-header-bg" />
            <h2>URGENT NEED</h2>
          </div>

          <div className="urgent-slider-wrapper">
            <div
              className="urgent-slider"
              style={{
                width: `${count * 100}%`,
                transform: `translateX(-${current * (100 / count)}%)`,
              }}
            >
              {slideGroups.map((group, idx) => (
                <div className="slide" key={idx}>
                  {group.map((item) => (
                    <div className="urgent-card" key={item.stage}>
                      <div className="card-image">
                        <img src={item.imageUrl} alt={item.stage} />
                      </div>
                      <div className="card-content">
                        <h3>{item.stage}</h3>
                        <p>{item.description}</p>
                        <div className="donation-bar">
                          <span className="donation-label">Donation</span>
                          <div className="progress">
                            <div
                              className="progress-filled"
                              style={{ width: `${item.donationPct}%` }}
                            />
                          </div>
                          <span className="donation-pct">
                            {item.donationPct}%
                          </span>
                        </div>
                        <button
                          className="donate-button"
                          onClick={() =>
                            item.donateUrl && window.open(item.donateUrl, '_blank')
                          }
                          disabled={!item.donateUrl}
                          title={
                            item.donateUrl
                              ? 'Open donate page'
                              : 'Donate link not provided'
                          }
                        >
                          <span className="donate-icon">🤲</span>Donate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="line" />

        {/* — Right: GET INVOLVED (unchanged) — */}
        <div className="get-involved-panel">
          <div className="urgent-header">
            <div className="urgent-header-bg" />
            <h2>GET INVOLVED</h2>
          </div>

          <div className="get-involved-card">
            <div className="card-image">
              <img src={getInvolveItem.imageUrl} alt={getInvolveItem.title} />
            </div>
            <div className="card-content">
              <h3>{getInvolveItem.title}</h3>
              <p>{getInvolveItem.description}</p>
              <button className="donate-button">{getInvolveItem.actionText}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

