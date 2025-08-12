import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

import HomePage from '../components/Overview/Home/HomePage';
import BeyondSMAPage from '../components/Overview/BeyondSMA/BeyondSMAPage';
import OurIdentityPage from '../components/Overview/OurIdentity/OurIdentityPage';

import ContactPage from '../components/Contact/ContactPage';

import LoginPage from '../components/Auth/LoginPage';
import RegisterPage from '../components/Auth/RegisterPage';
import RegisterPatientPage from '../components/Auth/RegisterPatientPage';

import PrivateRoute from './PrivateRoute';
import PatientDashboard from '../components/UserDashboards/PatientPortal/PatientDashboard';
import DonorDashboard from '../components/UserDashboards/DonorPortal/DonorDashboard';
import VolunteerDashboard from '../components/UserDashboards/VolunteerPortal/VolunteerDashboard';

import SMAEndgamePage from '../components/SMAEndgame/SMAEndgamePage';
import StriveLifeClubPage from '../components/SMAEndgame/StriveLifeClub/StriveLifeClubPage';
import StriveBeaconInitiativePage from '../components/SMAEndgame/StriveBeaconInitiative/StriveBeaconInitiativePage';
import StriveCureLabPage from '../components/SMAEndgame/StriveCureLab/StriveCureLabPage';

import OurLegacyPage  from '../components/OurLegacy/OurLegacyPage';
import EventDetailPage from '../components/OurLegacy/LegacyEvent/EventDetailPage';

import MediaCenter  from '../components/MediaCenter/MediaCenter';

import SmaRegistrationPage from '../components/SmaRegistration/SmaRegistrationPage';


export default function AppRoutes() {
  return (
    <Routes>
      {/* public pages under MainLayout */}
      <Route path="/" element={<MainLayout />}>

        <Route index element={<HomePage />} />
        <Route path="beyond-sma" element={<BeyondSMAPage />} />
        <Route path="our-identity" element={<OurIdentityPage />} />

        <Route path="sma-endgame" element={<SMAEndgamePage />} />
        <Route path="sma-endgame/life-club" element={<StriveLifeClubPage />} />
        <Route path="sma-endgame/beacon-initiative" element={<StriveBeaconInitiativePage />} />
        <Route path="sma-endgame/cure-lab" element={<StriveCureLabPage />} />

        <Route path="legacy"      element={<OurLegacyPage />} />
        <Route path="/our-legacy/event/:id" element={<EventDetailPage />} />

        <Route path="media-center"  element={<MediaCenter />} />

        <Route path="contact" element={<ContactPage />} />

        <Route path="register-sma" element={<SmaRegistrationPage />} />
        
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="patient-register" element={<RegisterPatientPage />} />

      </Route>

      {/* protected portals */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="patient" element={<PatientDashboard />} />
        <Route path="donor" element={<DonorDashboard />} />
        <Route path="volunteer" element={<VolunteerDashboard />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
