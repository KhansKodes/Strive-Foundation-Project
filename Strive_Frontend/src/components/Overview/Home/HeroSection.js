import React, { useState, useEffect, useRef } from 'react';
import './HeroSection.css';
import { getHomeCarouselImages } from '../../../services/carouselService';

const heroBgUrl =
  'https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg';

export default function HeroSection() {
  // only backend data (no dummy fallback)
  const [sliderImages, setSliderImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // fetch slides once from backend (/api/slides/)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const urls = await getHomeCarouselImages(); // slug no longer needed
      if (mounted) setSliderImages(urls);
    })();
    return () => { mounted = false; };
  }, []);

  // keep index valid when images arrive
  useEffect(() => {
    if (!sliderImages.length) return;
    setCurrent((c) => Math.min(c, sliderImages.length - 1));
  }, [sliderImages.length]);

  // autoplay only when we actually have slides
  const carouselRef = useRef();
  useEffect(() => {
    if (!sliderImages.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // keyboard nav
  function goTo(idx) { setCurrent(idx); }
  function handleKey(e) {
    if (!sliderImages.length) return;
    if (e.key === 'ArrowLeft')
      setCurrent((c) => (c - 1 + sliderImages.length) % sliderImages.length);
    if (e.key === 'ArrowRight')
      setCurrent((c) => (c + 1) % sliderImages.length);
  }

  // donation form (unchanged)
  const [form, setForm] = useState({
    frequency: 'Monthly',
    amount: '',
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  function handleInput(e) { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); setSuccess(''); }
  function validate() {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return 'Valid email required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 100) return 'Enter a valid amount (min 100 PKR)';
    return '';
  }
  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setSuccess('Thank you for your donation!');
    setForm({ frequency: 'Monthly', amount: '', name: '', email: '', phone: '' });
    setError('');
  }

  return (
    <section className="HeroSection-overview-hero">
      <div
        className="HeroSection-bgimg"
        style={{ backgroundImage: `url(${heroBgUrl})`, '--hero-bg-opacity': 0.55 }}
      />
      <div className="HeroSection-inner">
        {/* Carousel UI (unchanged). If no slides, it keeps layout space but shows nothing. */}
        <div
          className="HeroSection-carousel"
          tabIndex={0}
          ref={carouselRef}
          onKeyDown={handleKey}
          aria-busy={!sliderImages.length}
        >
          <div className="HeroSection-carousel-track">
            {sliderImages.map((img, idx) => {
              let pos = idx - current;
              const n = sliderImages.length;
              if (pos < -2) pos += n;
              if (pos > 2) pos -= n;
              if (Math.abs(pos) > 2) return null;
              return (
                <div
                  key={idx}
                  className={`HeroSection-card pos${pos}`}
                  style={{ backgroundImage: `url(${img})` }}
                  aria-hidden={idx !== current}
                />
              );
            })}
          </div>
          <div className="HeroSection-dots">
            {sliderImages.map((_, idx) => (
              <span
                key={idx}
                className={idx === current ? 'active' : ''}
                onClick={() => goTo(idx)}
                tabIndex={0}
                aria-label={`Go to slide ${idx + 1}`}
                onKeyDown={(e) => e.key === 'Enter' && goTo(idx)}
              />
            ))}
          </div>
        </div>

        {/* Donation form (unchanged) */}
        <form className="HeroSection-form-clone" onSubmit={handleSubmit} autoComplete="off">
          <h2>🤝 Donate Now!</h2>
          <input type="text" name="frequency" value={form.frequency} disabled placeholder="Monthly"
                 style={{ background: '#f8f8f8', pointerEvents: 'none' }} />
          <input type="number" name="amount" value={form.amount} onChange={handleInput}
                 placeholder="Amount (PKR)" min="100" required />
          <input type="text" name="name" value={form.name} onChange={handleInput}
                 placeholder="Your Name" required />
          <input type="email" name="email" value={form.email} onChange={handleInput}
                 placeholder="Your Email" required />
          <input type="text" name="phone" value={form.phone} onChange={handleInput}
                 placeholder="Your Phone (optional)" style={{ marginBottom: '14px' }} />
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button type="submit">Donate Now</button>
        </form>
      </div>
    </section>
  );
}
