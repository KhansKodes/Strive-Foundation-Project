import React from "react";
import "./InitiativesSection.css";
import { FiGlobe, FiAward, FiZap } from "react-icons/fi"; // valid icons

const CARDS = [
  {
    id: 1,
    title: "Card One",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mattis dui non felis efficitur.",
    icon: FiGlobe,
    theme: "theme-purple",
  },
  {
    id: 2,
    title: "Card Two",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mattis dui non felis efficitur.",
    icon: FiAward,
    theme: "theme-sunset",
  },
  {
    id: 3,
    title: "Card Three",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mattis dui non felis efficitur.",
    icon: FiZap,
    theme: "theme-mint",
  },
];

export default function InitiativesSection() {
  return (
    <section className="init-sec">
      <div className="init-row">
        {CARDS.map(({ id, title, desc, icon: Icon, theme }) => (
          <article key={id} className={`init-card ${theme}`}>

            {/* Left “bite” cutout */}
            <span className="init-notch" aria-hidden="true" />

            {/* Icon bubble inside the notch */}
            <span className="init-icon">
              <Icon className="icon" aria-hidden="true" />
            </span>

            {/* Right glossy circle with white ring */}
            <span className="init-ring" aria-hidden="true" />

            {/* Text */}
            <div className="init-text">
              <h3 className="init-title">{title}</h3>
              <p className="init-desc">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
  