import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './OurLegacyPage.css';
import { fetchIPRC, fetchEvents } from '../../services/legacyService';

// Collage assets (unchanged)
const bgImageUrl = 'https://picsum.photos/id/1005/180/120';
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

// Helper for "10 FEB 2011" format (does not change your CSS)
function fmt(d) {
  if (!d) return '';
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const mon = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const yr  = date.getFullYear();
  return `${day} ${mon} ${yr}`;
}

export default function OurLegacyPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Live data
  const [events, setEvents] = useState([]);
  const [iprc, setIprc] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Fetch once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [iprcRes, eventsRes] = await Promise.all([fetchIPRC(), fetchEvents()]);
        if (!mounted) return;
        // Keep only active IPRC rows; optional if API already filters
        setIprc(Array.isArray(iprcRes) ? iprcRes.filter(x => x.is_active !== false) : []);
        setEvents(Array.isArray(eventsRes) ? eventsRes : []);
      } catch (e) {
        console.error('Legacy load error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Build tab content WITHOUT changing your existing structure/classes
  const tabs = useMemo(() => ([
    {
      label: 'IPRC',
      content: (
        <div className="OurLegacyPage-content-inner">
          <div className="OurLegacyPage-timeline">
            {(loading ? Array.from({ length: 5 }) : iprc).map((item, idx) => (
              <div className="OurLegacyPage-timeline-item" key={item?.id ?? idx}>
                <span className="date">{item ? fmt(item.date) : '— — —'}</span>
                <span className="event-title">
                  {item?.title ?? 'Loading…'}
                </span>
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
            {(loading ? [] : events).map(event => (
              <div className="OurLegacyPage-timeline-item" key={event.id}>
                <span className="date">{fmt(event.date)}</span>
                <Link className="event-title event-link" to={event.slug ? `/our-legacy/event/slug/${event.slug}` : `/our-legacy/event/${event.id}`}>
                  {event.title}
                </Link>
              </div>
            ))}
            {(!loading && events.length === 0) && (
              <div className="OurLegacyPage-timeline-item">
                <span className="date">—</span>
                <span className="event-title">No events yet.</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ]), [iprc, events, loading]);

  return (
    <div className="OurLegacyPage">
      {/* HERO SECTION (unchanged) */}
      <section className="OurLegacyPage-hero">
        <div
          className="OurLegacyPage-hero-bg"
          style={{ backgroundImage: `url(${bgImageUrl})`, '--bg-opacity': 0.45 }}
        />
        <div className="OurLegacyPage-collage">
          {collageImages.map((src, idx) => (
            <img
              src={src}
              key={idx}
              alt=""
              className={`collage-img collage-${collageStyles[idx].anim}`}
              style={{ ...collageStyles[idx], position: 'absolute', animationDelay: `${idx * 0.37}s` }}
            />
          ))}
          <div className="OurLegacyPage-hero-title">OUR LEGACY</div>
        </div>
      </section>

      {/* CONTENT SECTION (unchanged layout/classes) */}
      <section className="OurLegacyPage-content-section">
        <div className="OurLegacyPage-tabs">
         {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`OurLegacyPage-tab-btn\${activeTab === idx ? ' active' : ''}`}
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
