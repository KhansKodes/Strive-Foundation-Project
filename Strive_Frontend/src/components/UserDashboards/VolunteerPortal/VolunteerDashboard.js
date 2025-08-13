import React from 'react';
import { useNavigate } from 'react-router-dom';
import VolunteerOverview from './VolunteerOverview';
import { useAuth } from '../../../hooks/useAuth';
import './VolunteerDashboard.css';

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const fullName = user?.profile?.fullName || "Volunteer";

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className='VolunteerDashboard'>
      <div className="dashboard-header">
        <h1>Welcome, {fullName}!</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <VolunteerOverview />
    </div>
  );
}
