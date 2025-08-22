import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PatientCountSection.css';
import api from '../../../services/api';

// Backend endpoints
const STATS_ENDPOINT = '/impact/stats/';   // returns an ARRAY with 1 object (latest stats)
const TEXTS_ENDPOINT = '/impact/texts/';   // returns an ARRAY of info cards

// Optional: adjust how you want to display the sponsored unit (matches your mock)
const SPONSORED_UNIT_LABEL = 'Million';
const SPONSORED_SUFFIX = '+';

// animate 0 -> target when section becomes visible
function useCountWhenVisible(target = 0, inView = false, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const to = Number(target) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, inView, duration]);
  return val;
}

export default function PatientCountSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // stats from /impact/stats/
  const [stats, setStats] = useState({
    patients_treated: 0,
    treatment_cycles: 0,
    sponsored_amount: 0,
    sponsored_currency: 'PKR',
  });

  // texts/cards from /impact/texts/
  const [cards, setCards] = useState([]);

  // fetch both endpoints
  useEffect(() => {
    (async () => {
      try {
        const [statsRes, textsRes] = await Promise.all([
          api.get(STATS_ENDPOINT),
          api.get(TEXTS_ENDPOINT),
        ]);

        // /impact/stats/ -> array with one object OR a single object; handle both
        const rawStats = statsRes?.data;
        const s = Array.isArray(rawStats) ? rawStats[0] : rawStats || {};
        setStats({
          patients_treated: Number(s?.patients_treated) || 0,
          treatment_cycles: Number(s?.treatment_cycles) || 0,
          sponsored_amount: Number(s?.sponsored_amount) || 0,
          sponsored_currency: s?.sponsored_currency || 'PKR',
        });

        // /impact/texts/ -> array
        const arr = Array.isArray(textsRes?.data) ? textsRes.data : [];
        const cleaned = arr
          .filter((c) => c.is_active)
          .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
          .slice(0, 3); // show first 3
        setCards(cleaned);
      } catch (e) {
        console.error('Failed to load impact data:', e);
        setCards([]);
      }
    })();
  }, []);

  // observe section visibility to trigger counters
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setInView(true),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // animated values
  const patients = useCountWhenVisible(stats.patients_treated, inView);
  const cycles = useCountWhenVisible(stats.treatment_cycles, inView);
  const sponsored = useCountWhenVisible(stats.sponsored_amount, inView);

  // labels stay fixed to match your screenshot
  const labels = useMemo(
    () => ({
      patients: { top: '', l1: 'PATIENTS', l2: 'TREATED', suffix: '+' },
      cycles:   { top: '', l1: 'TREATMENT', l2: 'CYCLES', suffix: '+' },
      sponsor:  { top: stats.sponsored_currency || 'PKR', l1: 'SPONSORED', l2: '' },
    }),
    [stats.sponsored_currency]
  );

  // stat tile component (uses your existing CSS classes)
  const Stat = ({ top, value, unit, suffix, l1, l2 }) => (
    <div className="stat-item">
      <span className="stat-number">
        {top ? <span className="small">{top}</span> : null}
        {value}
        {(unit || suffix) ? (
          <span className="small"> {`${unit || ''}${suffix ? ` ${suffix}` : ''}`.trim()}</span>
        ) : null}
      </span>
      <span className="stat-title">
        {l1}<br />{l2}
      </span>
    </div>
  );

  return (
    <section className="PatientCountSection" ref={sectionRef}>
      {/* Top metrics row */}
      <div className="stats-top">
        <Stat
          top={labels.patients.top}
          value={`${patients}${labels.patients.suffix}`}
          unit=""
          suffix=""
          l1={labels.patients.l1}
          l2={labels.patients.l2}
        />
        <Stat
          top={labels.cycles.top}
          value={`${cycles}${labels.cycles.suffix}`}
          unit=""
          suffix=""
          l1={labels.cycles.l1}
          l2={labels.cycles.l2}
        />
        <Stat
          top={labels.sponsor.top}
          value={sponsored}
          unit={SPONSORED_UNIT_LABEL}
          suffix={SPONSORED_SUFFIX}
          l1={labels.sponsor.l1}
          l2={labels.sponsor.l2}
        />
      </div>

      {/* timeline line + small triangles */}
      <div className="timeline">
        <div className="line" />
        <div className="arrow" style={{ left: '33.333%' }} />
        <div className="arrow" style={{ left: '66.666%' }} />
      </div>

      {/* Bottom info cards */}
      <div className="stats-bottom">
        {(cards.length ? cards : Array.from({ length: 3 })).map((c, i) => (
          <div key={c?.id ?? i} className="info-card">
            {/* optional title */}
            {c?.title ? <h4 className="card-title">{c.title}</h4> : null}
            <p>{c?.body || '\u00A0'}</p>
            {(c?.emphasis_label || c?.emphasis_value) ? (
              <p className="subtext">
                {c.emphasis_label ? <strong>{c.emphasis_label}:</strong> : null}{' '}
                {c.emphasis_value || ''}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
