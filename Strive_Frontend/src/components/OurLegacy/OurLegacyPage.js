import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OurLegacyPage.css';

// Collage images and styles
const bgImageUrl = 'https://picsum.photos/id/1005/180/120'; // Dummy background image

const collageImages = [
  'https://picsum.photos/id/1005/180/120',
  'https://picsum.photos/id/1011/150/100',
  'https://picsum.photos/id/1016/200/130',
  'https://picsum.photos/id/1025/130/90',
  'https://picsum.photos/id/1020/160/110',
  'https://picsum.photos/id/1033/120/90',
  'https://picsum.photos/id/1052/180/120',
  'https://picsum.photos/id/1062/140/100'
];

const collageStyles = [
  { left: '5%',   top: '30px',  width: 250, zIndex: 2, anim: 'float1' },
  { left: '30%',  top: '75px',  width: 200, zIndex: 3, anim: 'float2' },
  { left: '45%',  top: '8px',   width: 250, zIndex: 4, anim: 'float3' },
  { left: '60%',  top: '60px',  width: 250,  zIndex: 2, anim: 'float4' },
  { left: '75%',  top: '18px',  width: 200, zIndex: 5, anim: 'float5' },
  { left: '17%',  top: '160px', width: 200, zIndex: 2, anim: 'float3' },
  { left: '48%',  top: '170px', width: 220, zIndex: 3, anim: 'float2' },
  { left: '80%',  top: '120px', width: 220, zIndex: 2, anim: 'float4' }
];

// Dummy data for events (with unique IDs)
const eventData = [
  { id: 1, date: "10 FEB 2011", title: "Events2" },
  { id: 2, date: "12 JUN 2012", title: "Events3" },
  { id: 3, date: "05 SEP 2013", title: "Events4" },
  { id: 4, date: "11 MAR 2014", title: "Events5" },
  { id: 5, date: "23 AUG 2015", title: "Events6" },
  { id: 6, date: "04 DEC 2016", title: "Events7" },
];

const tabs = [
  {
    label: 'IPRC',
    content: (
      <div className="OurLegacyPage-content-inner">
        <div className="OurLegacyPage-timeline">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div className="OurLegacyPage-timeline-item" key={idx}>
              <span className="date">10 FEB 2011</span>
              <span className="event-title">Artificial Intelligence via Biotechnology - Disability-Cure</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Events',
    content: (
      <div className="OurLegacyPage-content-inner">
        <div className="OurLegacyPage-timeline">
          {eventData.map(event => (
            <div className="OurLegacyPage-timeline-item" key={event.id}>
              <span className="date">{event.date}</span>
              <Link className="event-title event-link" to={`/our-legacy/event/${event.id}`}>
                {event.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function OurLegacyPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="OurLegacyPage">
      {/* HERO SECTION */}
      <section className="OurLegacyPage-hero">
        <div
          className="OurLegacyPage-hero-bg"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            '--bg-opacity': 0.45,
          }}
        />
        <div className="OurLegacyPage-collage">
          {collageImages.map((src, idx) => (
            <img
              src={src}
              key={idx}
              alt=""
              className={`collage-img collage-${collageStyles[idx].anim}`}
              style={{
                ...collageStyles[idx],
                position: 'absolute',
                animationDelay: `${idx * 0.37}s`,
              }}
            />
          ))}
          <div className="OurLegacyPage-hero-title">
            OUR LEGACY
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="OurLegacyPage-content-section">
        <div className="OurLegacyPage-tabs">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`OurLegacyPage-tab-btn${activeTab === idx ? ' active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="OurLegacyPage-content">
          <div className="OurLegacyPage-content-transition" key={activeTab}>
            {tabs[activeTab].content}
          </div>
        </div>
      </section>
      <br />
    </div>
  );
}
