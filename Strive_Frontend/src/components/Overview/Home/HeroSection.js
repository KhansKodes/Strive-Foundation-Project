import React, { useState, useEffect, useRef } from 'react';
import './HeroSection.css';

const heroBgUrl = 'https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg';

const sliderImages = [
  'https://picsum.photos/id/1015/350/450',
  'https://picsum.photos/id/1016/350/450',
  'https://picsum.photos/id/1018/350/450',
  'https://picsum.photos/id/1020/350/450',
  'https://picsum.photos/id/1024/350/450',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(2);

  // Auto-play every 3s, pause on hover/focus
  const carouselRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Carousel dots and keyboard navigation
  function goTo(idx) {
    setCurrent(idx);
  }
  function handleKey(e) {
    if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + sliderImages.length) % sliderImages.length);
    if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % sliderImages.length);
  }

  // Donation form state
  const [form, setForm] = useState({
    frequency: 'Monthly',
    amount: '',
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return 'Valid email required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 100)
      return 'Enter a valid amount (min 100 PKR)';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setSuccess('Thank you for your donation!');
    setForm({ frequency: 'Monthly', amount: '', name: '', email: '', phone: '' });
    setError('');
    // You can add your backend call here!
  }

  return (
    <section className="HeroSection-overview-hero">
      <div
        className="HeroSection-bgimg"
        style={{
          backgroundImage: `url(${heroBgUrl})`,
          '--hero-bg-opacity': 0.55,
        }}
      />
      <div className="HeroSection-inner">
        {/* Carousel */}
        <div className="HeroSection-carousel" tabIndex={0} ref={carouselRef} onKeyDown={handleKey}>
          <div className="HeroSection-carousel-track">
            {sliderImages.map((img, idx) => {
              let pos = idx - current;
              if (pos < -2) pos += sliderImages.length;
              if (pos > 2) pos -= sliderImages.length;
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
                onKeyDown={e => e.key === 'Enter' && goTo(idx)}
              />
            ))}
          </div>
        </div>
        {/* Donation Form */}
        <form className="HeroSection-form-clone" onSubmit={handleSubmit} autoComplete="off">
          <h2>🤝 Donate Now!</h2>
          <input
            type="text"
            name="frequency"
            value={form.frequency}
            disabled
            placeholder="Monthly"
            style={{ background: '#f8f8f8', pointerEvents: 'none' }}
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleInput}
            placeholder="Amount (PKR)"
            min="100"
            required
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInput}
            placeholder="Your Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleInput}
            placeholder="Your Phone (optional)"
            style={{ marginBottom: '14px' }}
          />
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button type="submit">Donate Now</button>
        </form>
      </div>
    </section>
  );
}
