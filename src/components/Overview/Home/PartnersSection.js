import React from 'react';
import './PartnersSection.css';

const partners = [
  { name: 'Partner A', logo: 'https://picsum.photos/seed/partner1/150' },
  { name: 'Partner B', logo: 'https://picsum.photos/seed/partner2/150' },
  { name: 'Partner C', logo: 'https://picsum.photos/seed/partner3/150' },
  { name: 'Partner D', logo: 'https://picsum.photos/seed/partner4/150' },
  { name: 'Partner E', logo: 'https://picsum.photos/seed/partner5/150' },
];

export default function PartnersSection() {
  return (
    <section className="PartnersSection">
      <h2 className="PartnersSection__title">
        Our Partners / Donors <span className="PartnersSection__arrow">👇</span>
      </h2>
      <div className="PartnersSection__grid">
        {partners.map((p, i) => (
          <div key={i} className="PartnersSection__item">
            <img
              src={p.logo}
              alt={p.name}
              className="PartnersSection__img"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
