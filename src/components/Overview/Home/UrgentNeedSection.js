import React, { useState, useEffect } from 'react';
import './UrgentNeedSection.css';

const urgentItems = [
  {
    stage: 'SMA stage 1',
    description:
      'Baby A needs immediate spinal muscular atrophy treatment to stand a chance at a normal life.',
    imageUrl: 'https://picsum.photos/400/200?random=11',
    donationPct: 50,
  },
  {
    stage: 'SMA stage 2',
    description:
      'Child B’s breathing is affected. Your help can fund her next dose.',
    imageUrl: 'https://picsum.photos/400/200?random=12',
    donationPct: 95,
  },
  {
    stage: 'SMA stage 3',
    description:
      'Toddler C is losing motor function. Every rupee brings hope.',
    imageUrl: 'https://picsum.photos/400/200?random=13',
    donationPct: 70,
  },
];

// build sliding windows of two, wrapping at the end
const slideGroups = urgentItems.map((_, i) => [
  urgentItems[i],
  urgentItems[(i + 1) % urgentItems.length],
]);

const getInvolveItem = {
  title: 'Community Champion',
  description:
    'Host a local fundraiser in your area and multiply our reach. Host a local fundraiser in your area and multiply our reach.',
  imageUrl: 'https://picsum.photos/400/250?random=21',
  actionText: 'Get Started',
};

export default function UrgentNeedSection() {
  const [current, setCurrent] = useState(0);
  const count = slideGroups.length;

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, 4000);
    return () => clearInterval(iv);
  }, [count]);

  return (
    <section className="UrgentNeedSection">
      <div className="split-container">
        {/* — Left: Urgent Need (60%) — */}
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
                          <span className="donation-label">
                            Donation
                          </span>
                          <div className="progress">
                            <div
                              className="progress-filled"
                              style={{
                                width: `${item.donationPct}%`,
                              }}
                            />
                          </div>
                          <span className="donation-pct">
                            {item.donationPct}%
                          </span>
                        </div>
                        <button className="donate-button">
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

        <hr className='line'></hr>

        {/* — Right: Get Involved (40%) — */}
      <div className="get-involved-panel">
          <div className="urgent-header">
              <div className="urgent-header-bg" />
              <h2>GET INVOLVED</h2>
          </div>
          <div className="involved-card">
              <div className="card-image">
                <img
                  src={getInvolveItem.imageUrl}
                  alt={getInvolveItem.title}
                />
              </div>
              <div className="card-content">
                <h3>{getInvolveItem.title}</h3>
                <p>{getInvolveItem.description}</p>
                <button className="donate-button">
                  {getInvolveItem.actionText}
                </button>
              </div>
          </div>
      </div>

      </div>
    </section>
  );
}
