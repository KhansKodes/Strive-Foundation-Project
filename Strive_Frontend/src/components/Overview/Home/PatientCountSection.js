import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PatientCountSection.css';
import api from '../../../services/api';

// --- Backend endpoints (adjust if your paths differ) ---
const STATS_ENDPOINT = '/impact/stats/';   // -> { patients_treated, treatment_cycles, sponsored_amount, sponsored_currency }
const CARDS_ENDPOINT = '/impact/cards/';   // -> [ { id, title, body, emphasis_label, emphasis_value, display_order, is_active } ]

// small helper: animated count up when visible
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
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // state from backend
  const [stats, setStats] = useState({
    patients_treated: 0,
    treatment_cycles: 0,
    sponsored_amount: 0,
    sponsored_currency: 'PKR',
  });
  const [cards, setCards] = useState([]);

  // fetch both endpoints
  useEffect(() => {
    (async () => {
      try {
        const [statsRes, cardsRes] = await Promise.all([
          api.get(STATS_ENDPOINT),
          api.get(CARDS_ENDPOINT),
        ]);

        // stats: single object
        const s = statsRes?.data || {};
        setStats({
          patients_treated: Number(s.patients_treated) || 0,
          treatment_cycles: Number(s.treatment_cycles) || 0,
          sponsored_amount: Number(s.sponsored_amount) || 0,
          sponsored_currency: s.sponsored_currency || 'PKR',
        });

        // cards: array
        const arr = Array.isArray(cardsRes?.data) ? cardsRes.data : [];
        const cleaned = arr
          .filter((c) => c.is_active)
          .sort((a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0));
        setCards(cleaned);
      } catch (e) {
        console.error('Impact fetch failed:', e);
        setCards([]);
      }
    })();
  }, []);

  // start counters once section is on screen
  useEffect(() => {
    const el = ref.current;
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

  // stat tiles (keeps your existing CSS classes)
  const Stat = ({ prefix, value, unit, suffix, l1, l2 }) => (
    <div className="stat-item">
      <span className="stat-number">
        {prefix ? <span className="small">{prefix}&nbsp;</span> : null}
        {value}
        {(unit || suffix) ? (
          <span className="small">&nbsp;{[unit, suffix].filter(Boolean).join(' ')}</span>
        ) : null}
      </span>
      <span className="stat-title">
        {l1}<br />{l2}
      </span>
    </div>
  );

  // memo labels so UI text remains exactly like your mock
  const metricLabels = useMemo(
    () => ({
      patients: { l1: 'PATIENTS', l2: 'TREATED', suffix: '+' },
      cycles:   { l1: 'TREATMENT', l2: 'CYCLES',  suffix: '+' },
      sponsor:  { l1: 'SPONSORED', l2: '' },
    }),
    []
  );

  return (
    <section className="PatientCountSection" ref={ref}>
      {/* Top metrics row */}
      <div className="stats-top">
        <Stat
          prefix=""
          value={`${patients}${metricLabels.patients.suffix}`}
          unit=""
          suffix=""
          l1={metricLabels.patients.l1}
          l2={metricLabels.patients.l2}
        />
        <Stat
          prefix=""
          value={`${cycles}${metricLabels.cycles.suffix}`}
          unit=""
          suffix=""
          l1={metricLabels.cycles.l1}
          l2={metricLabels.cycles.l2}
        />
        <Stat
          prefix={stats.sponsored_currency}
          value={sponsored}
          unit="Million"
          suffix="+"
          l1={metricLabels.sponsor.l1}
          l2={metricLabels.sponsor.l2}
        />
      </div>

      {/* Mid line with little arrows (CSS already styles this) */}
      <div className="timeline">
        <div className="line" />
        <div className="arrow" style={{ left: '33.333%' }} />
        <div className="arrow" style={{ left: '66.666%' }} />
      </div>

      {/* Bottom info cards */}
      <div className="stats-bottom">
        {(cards.length ? cards : Array.from({ length: 3 })).slice(0, 3).map((c, i) => (
          <div key={c?.id ?? i} className="info-card">
            {/* Title is optional in your API; omit if empty */}
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
