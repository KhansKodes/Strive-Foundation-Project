import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const heroBgUrl = 'https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg'; // Use your uploaded background (public path or try direct file for now)

const sliderImages = [
  'https://picsum.photos/id/1015/350/450',
  'https://picsum.photos/id/1016/350/450',
  'https://picsum.photos/id/1018/350/450',
  'https://picsum.photos/id/1020/350/450',
  'https://picsum.photos/id/1024/350/450',
];

function FormClone({ title, btnText, onClick }) {
  return (
    <div className="HeroSection-form-clone" onClick={onClick} tabIndex={0}>
      <h2>{title}</h2>
      <input type="text" disabled placeholder="Monthly" />
      <input type="text" disabled placeholder="5000 PKR" />
      <input type="text" disabled placeholder="5000 PKR" />
      <input type="text" disabled placeholder="5000 PKR" />
      <button>{btnText}</button>
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  function handleFormClick() {
    window.location.href = '/donate';
  }
  function handleRegClick() {
    window.location.href = '/register-sma';
  }


  return (
    <section className="HeroSection-overview-hero">
      <div
        className="HeroSection-bgimg"
        style={{
          backgroundImage: `url(${heroBgUrl})`,
          '--hero-bg-opacity': 0.55, // Adjust this value (0.3 = lighter, 0.7 = darker)
        }}
      />
      <div className="HeroSection-inner">
        <FormClone title="Make a Donation" btnText="Donate Now" onClick={handleFormClick} />
        <div className="HeroSection-carousel">
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
                  style={{
                    backgroundImage: `url(${img})`,
                  }}
                />
              );
            })}
          </div>
          <div className="HeroSection-dots">
            {sliderImages.map((_, idx) => (
              <span key={idx} className={idx === current ? 'active' : ''} />
            ))}
          </div>
        </div>
        <FormClone title="Patient Registration" btnText="Register Now" onClick={handleRegClick} />
      </div>
    </section>
  );
}
