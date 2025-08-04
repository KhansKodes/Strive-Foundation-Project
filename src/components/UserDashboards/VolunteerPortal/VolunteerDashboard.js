import React from 'react';
import VolunteerOverview from './VolunteerOverview';
import { useAuth } from '../../../hooks/useAuth';
import './VolunteerDashboard.css';


export default function VolunteerDashboard() {
  const { user } = useAuth();
  return (
    <div className='VolunteerDashboard'>
      <h1>{user.username}'s Portal</h1>
      <VolunteerOverview />
    </div>
  );
}
