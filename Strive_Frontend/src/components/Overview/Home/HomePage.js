// HomePage.js
import React from 'react';
import HeroSection from './HeroSection';
import VisionSection from './VisionSection';
import PatientCountSection from './PatientCountSection';
import UrgentNeedSection from './UrgentNeedSection';      
import InitiativesSection from './InitiativesSection';
import NewsSection from './NewsSection';
import PartnersSection from './PartnersSection';
import MediaVolunteerSection from './MediaVolunteerSection';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="HomePage">
      <HeroSection />
      <VisionSection />
      <PatientCountSection />
      <UrgentNeedSection />
      <InitiativesSection />
      <NewsSection />
      <MediaVolunteerSection />
      <PartnersSection />
      <br></br>
    </div>
  );
}
