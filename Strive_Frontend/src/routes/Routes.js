// src/routes/Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public layout & pages
import MainLayout from '../components/Layout/MainLayout';

import HomePage from '../components/Overview/Home/HomePage';
import BeyondSMAPage from '../components/Overview/BeyondSMA/BeyondSMAPage';
import OurIdentityPage from '../components/Overview/OurIdentity/OurIdentityPage';

import ContactPage from '../components/Contact/ContactPage';

import LoginPage from '../components/Auth/LoginPage';
import RegisterPage from '../components/Auth/RegisterPage';
import RegisterPatientPage from '../components/Auth/RegisterPatientPage';

import SMAEndgamePage from '../components/SMAEndgame/SMAEndgamePage';
import StriveLifeClubPage from '../components/SMAEndgame/StriveLifeClub/StriveLifeClubPage';
import StriveBeaconInitiativePage from '../components/SMAEndgame/StriveBeaconInitiative/StriveBeaconInitiativePage';
import StriveCureLabPage from '../components/SMAEndgame/StriveCureLab/StriveCureLabPage';

import OurLegacyPage  from '../components/OurLegacy/OurLegacyPage';
import EventDetailPage from '../components/OurLegacy/LegacyEvent/EventDetailPage';

import MediaCenter  from '../components/MediaCenter/MediaCenter';
import Newsroom from '../components/MediaCenter/Newsroom/Newsroom';
import Gallery from '../components/MediaCenter/Gallery/Gallery';
import Downloads from '../components/MediaCenter/Downloads/Downloads';

import SmaRegistrationPage from '../components/SmaRegistration/SmaRegistrationPage';

// Auth / Protected
import PrivateRoute from './PrivateRoute';
import PatientDashboard from '../components/UserDashboards/PatientPortal/PatientDashboard';
import DonorDashboard from '../components/UserDashboards/DonorPortal/DonorDashboard';
import VolunteerDashboard from '../components/UserDashboards/VolunteerPortal/VolunteerDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site under MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="beyond-sma" element={<BeyondSMAPage />} />
        <Route path="our-identity" element={<OurIdentityPage />} />

        <Route path="sma-endgame" element={<SMAEndgamePage />} />
        <Route path="sma-endgame/life-club" element={<StriveLifeClubPage />} />
        <Route path="sma-endgame/beacon-initiative" element={<StriveBeaconInitiativePage />} />
        <Route path="sma-endgame/cure-lab" element={<StriveCureLabPage />} />

        <Route path="legacy" element={<OurLegacyPage />} />
        {/* Detail routes — both id and slug */}
        <Route path="our-legacy/event/:id" element={<EventDetailPage />} />
        <Route path="our-legacy/event/slug/:slug" element={<EventDetailPage />} />

        <Route path="media-center" element={<MediaCenter />} />
        <Route path="media-center/newsroom" element={<Newsroom />} />
        <Route path="media-center/gallery" element={<Gallery />} />
        <Route path="media-center/downloads" element={<Downloads />} />

        <Route path="contact" element={<ContactPage />} />

        <Route path="register-sma" element={<SmaRegistrationPage />} />

        {/* Auth pages */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="patient-register" element={<RegisterPatientPage />} />
      </Route>

      {/* Protected portals (all dashboards live under /portal/...) */}
      <Route path="/portal" element={<PrivateRoute />}>
        {/* Default landing under /portal — you can change this target if you auto-route by role after login */}
        <Route index element={<Navigate to="patient" replace />} />
        <Route path="patient/*" element={<PatientDashboard />} />
        <Route path="donor/*" element={<DonorDashboard />} />
        <Route path="volunteer/*" element={<VolunteerDashboard />} />
      </Route>

      {/* Backward-compatible redirects from legacy paths to /portal/... */}
      <Route path="/patient/*" element={<Navigate to="/portal/patient" replace />} />
      <Route path="/donor/*" element={<Navigate to="/portal/donor" replace />} />
      <Route path="/volunteer/*" element={<Navigate to="/portal/volunteer" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
