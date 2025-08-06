import React, { useRef, useState, useEffect } from 'react';
import './PatientCountSection.css';

export default function PatientCountSection() {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  const [children, setChildren] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [sponsored, setSponsored] = useState(0);

  // targets
  const targetChildren  = 120;
  const targetCycles    = 65;
  const targetSponsored = 70; // millions

  // 1) Observe when section scrolls into view
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // 2) Animate the counts
  useEffect(() => {
    if (!inView) return;
    const duration = 1500;

    function animate(to, setter) {
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        setter(Math.floor(prog * to));
        if (prog < 1) requestAnimationFrame(step);
        else setter(to);
      }
      requestAnimationFrame(step);
    }

    animate(targetChildren, setChildren);
    animate(targetCycles,   setCycles);
    animate(targetSponsored, setSponsored);
  }, [inView]);

  return (
    <section className="PatientCountSection" ref={ref}>
      <div className="container">

        {/* Top row stats */}
        <div className="stats-top">
          <div className="stat-item">
            <span className="stat-number">{children}+</span>
            <span className="stat-title">patients Treated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{cycles}+</span>
            <span className="stat-title">Treatment Cycles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              <span className="small">PKR</span> {sponsored} <span className="small">Million +</span>
            </span>
            <span className="stat-title">Sponsored</span>
          </div>
        </div>

        {/* Timeline with arrows */}
        <div className="timeline">
          <div className="line" />
          <div className="arrow" style={{ left: '33.33%' }} />
          <div className="arrow" style={{ left: '66.66%' }} />
        </div>

        {/* Bottom info‐cards */}
        <div className="stats-bottom">
          <div className="info-card">
            <p>Every child received life‑saving treatment once considered impossible in Pakistan.</p>
            <p className="subtext"><strong>Annual Cost:</strong> PKR 2.5M–7M per patient</p>
          </div>
          <div className="info-card">
            <p>Every patient requires multiple cycles, each one is as critical and costly as treating a new patient, ensuring continued improvement and survival.</p>
          </div>
          <div className="info-card">
            <p>Funded entirely through our mission to fight SMA, one of the world’s costliest rare diseases, over 3 years of committed action.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
