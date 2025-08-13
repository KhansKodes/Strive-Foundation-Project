import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonations } from '../../../services/donorService';
import DonationSummary from './DonationSummary';
import { useAuth } from '../../../hooks/useAuth';
import './DonorDashboard.css';

export default function DonorDashboard() {
  const [dons, setDons] = useState([]);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    getDonations().then(setDons);
  }, []);

  const fullName = user?.profile?.fullName || "Donor";

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className='DonorDashboard'>
      <div className="dashboard-header">
        <h1>Welcome, {fullName}!</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h2>Your Donations</h2>
      {dons.map(d => <DonationSummary key={d.id} donation={d} />)}
    </div>
  );
}
