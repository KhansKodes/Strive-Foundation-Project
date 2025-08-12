import React from 'react';
import VolunteerOverview from './VolunteerOverview';
import { useAuth } from '../../../hooks/useAuth';
import './VolunteerDashboard.css';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const fullName = user?.profile?.fullName || "Volunteer";

  return (
    <div className='VolunteerDashboard'>
      <h1>Welcome, {fullName}!</h1>
      <VolunteerOverview />
    </div>
  );
}
