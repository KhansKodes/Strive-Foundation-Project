import React from 'react';
import './InitiativesSection.css';

const initiatives = [
  {
    title: 'Medical Support',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget',
    iconUrl: 'https://picsum.photos/80/80?random=10',
  },
  {
    title: 'Research',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget',
    iconUrl: 'https://picsum.photos/80/80?random=20',
  },
  {
    title: 'Advocacy',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget',
    iconUrl: 'https://picsum.photos/80/80?random=30',
  },
];

export default function InitiativesSection() {
  return (
    <section className="InitiativesSection">
      <h2>Our Initiatives</h2>

      <div className="initiatives-wrapper">

        <ul className="initiatives-list">
          {initiatives.map((item) => (
            <li className="initiative-card" key={item.title}>
              <div className="initiative-icon">
                <img src={item.iconUrl} alt={item.title} />
              </div>
              <h3 className="initiative-title">{item.title}</h3>
              <p className="initiative-desc">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
